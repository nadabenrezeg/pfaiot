// src/services/ModelUploader.js
import { launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, ref, storage, uploadBytes } from './firebase';

/**
 * Service pour uploader des modèles ONNX vers Firebase Storage
 * @returns {Promise<string>} URL de téléchargement du modèle
 */
const uploadONNXModel = async () => {
  try {
    // 1. Sélection du fichier
    const selection = await launchImageLibrary({
      mediaType: 'mixed',
      type: 'application/octet-stream',
    });

    if (selection.didCancel || !selection.assets?.[0]) {
      throw new Error('Sélection annulée ou aucun fichier choisi');
    }

    const { uri, name: fileName } = selection.assets[0];

    // 2. Vérification de l'extension
    if (!fileName.toLowerCase().endsWith('.onnx')) {
      throw new Error('Seuls les fichiers .onnx sont acceptés');
    }

    // 3. Conversion en Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // 4. Création de la référence de stockage
    const modelRef = ref(storage, `onnx-models/${Date.now()}_${fileName}`);

    // 5. Upload vers Firebase
    await uploadBytes(modelRef, blob, {
      contentType: 'application/octet-stream',
    });

    // 6. Récupération de l'URL
    const downloadURL = await getDownloadURL(modelRef);
    
    return {
      success: true,
      downloadURL,
      fileName,
    };

  } catch (error) {
    console.error('Échec de l\'upload:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default uploadONNXModel;