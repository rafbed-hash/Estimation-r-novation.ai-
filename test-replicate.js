// Test de l'API Replicate
async function testReplicateAPI() {
  const testData = {
    dimensions: {
      longueur: 12,
      largeur: 10,
      hauteur: 9
    },
    photosProjetUrls: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ],
    inspirationsUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
    ],
    style: "Moderne",
    palette: "Neutre"
  };

  try {
    console.log("🧪 Test API Replicate...");
    
    const response = await fetch('http://localhost:3000/api/transform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log("✅ Résultat:", JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log("🎉 Test réussi!");
      console.log("📸 Avant:", result.avantUrl);
      console.log("🎨 Après:", result.apresUrl);
      console.log("⏱️ Temps:", result.meta.processingTime + "ms");
      console.log("🤖 Modèle:", result.meta.model);
    } else {
      console.log("❌ Test échoué:", result.error);
    }
    
  } catch (error) {
    console.error("💥 Erreur test:", error);
  }
}

// Lancer le test si ce fichier est exécuté directement
if (typeof window === 'undefined') {
  testReplicateAPI();
}

module.exports = { testReplicateAPI };
