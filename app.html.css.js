<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chronicle of Tomorrow</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0a0a1a;
            color: #e0e0e0;
        }
        .font-orbitron {
            font-family: 'Orbitron', sans-serif;
        }
        .glass-panel {
            background: rgba(20, 20, 40, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-generate {
            background: linear-gradient(45deg, #4f46e5, #c026d3);
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(79, 70, 229, 0.5), 0 0 20px rgba(192, 38, 211, 0.3);
        }
        .btn-generate:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 25px rgba(79, 70, 229, 0.7), 0 0 30px rgba(192, 38, 211, 0.5);
        }
        .loader {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-left-color: #4f46e5;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .result-image {
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style="background-image: url('https://placehold.co/1920x1080/0a0a1a/e0e0e0?text=.')">

    <div class="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <!-- Header -->
        <header class="text-center">
            <h1 class="font-orbitron text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Chronicle of Tomorrow
            </h1>
            <p class="text-indigo-200 mt-2">Glimpse into the headlines of the world to come.</p>
        </header>

        <!-- Input Section -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="relative w-full">
                <label for="year-input" class="absolute -top-2 left-3 bg-[#141428] px-1 text-xs text-indigo-300">Future Year</label>
                <input type="number" id="year-input" class="w-full bg-transparent border-2 border-indigo-500/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" placeholder="e.g., 2077" min="2025">
            </div>
            <button id="generate-btn" class="btn-generate text-white font-bold py-3 px-8 rounded-lg w-full sm:w-auto flex-shrink-0">
                Generate News
            </button>
        </div>

        <!-- Result Section -->
        <div id="result-container" class="hidden space-y-6 pt-4">
            <div id="loader" class="flex justify-center hidden">
                <div class="loader"></div>
            </div>
            <div id="error-box" class="hidden p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
                <p id="error-message"></p>
            </div>
            <article id="news-article" class="hidden space-y-4">
                <div class="w-full h-64 md:h-80 bg-black/30 rounded-lg overflow-hidden flex items-center justify-center result-image">
                    <img id="news-image" src="" alt="AI generated image for the news article" class="w-full h-full object-cover hidden">
                    <p id="image-placeholder" class="text-gray-400">Generating futuristic image...</p>
                </div>
                <h2 id="news-headline" class="font-orbitron text-2xl md:text-3xl font-bold text-purple-300"></h2>
                <p id="news-body" class="text-gray-300 leading-relaxed"></p>
            </article>
        </div>
    </div>

    <script>
        const generateBtn = document.getElementById('generate-btn');
        const yearInput = document.getElementById('year-input');
        const resultContainer = document.getElementById('result-container');
        const loader = document.getElementById('loader');
        const errorBox = document.getElementById('error-box');
        const errorMessage = document.getElementById('error-message');
        const newsArticle = document.getElementById('news-article');
        const newsImage = document.getElementById('news-image');
        const imagePlaceholder = document.getElementById('image-placeholder');
        const newsHeadline = document.getElementById('news-headline');
        const newsBody = document.getElementById('news-body');

        // Set default year to next year
        yearInput.value = new Date().getFullYear() + 1;

        generateBtn.addEventListener('click', handleGeneration);

        async function handleGeneration() {
            const year = yearInput.value;
            if (!year || year <= new Date().getFullYear()) {
                showError('Please enter a valid year in the future.');
                return;
            }

            // Reset UI
            hideError();
            resultContainer.classList.remove('hidden');
            newsArticle.classList.add('hidden');
            loader.classList.remove('hidden');
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            newsImage.classList.add('hidden');
            imagePlaceholder.classList.remove('hidden');


            try {
                // Generate image and text in parallel for speed
                const [imageData, newsContent] = await Promise.all([
                    generateImage(year),
                    generateNews(year)
                ]);

                // Display results
                displayResults(imageData, newsContent);

            } catch (error) {
                console.error('An error occurred:', error);
                showError('Failed to generate future news. Please try again.');
            } finally {
                // Re-enable button and hide loader
                loader.classList.add('hidden');
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate News';
            }
        }

        function displayResults(imageData, newsContent) {
            const { headline, body } = newsContent;

            newsImage.src = data:image/png;base64,${imageData};
            newsImage.onload = () => {
                newsImage.classList.remove('hidden');
                imagePlaceholder.classList.add('hidden');
            };
            newsHeadline.textContent = headline;
            newsBody.textContent = body;
            newsArticle.classList.remove('hidden');
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorBox.classList.remove('hidden');
        }

        function hideError() {
            errorBox.classList.add('hidden');
        }

        // --- API Call Functions with Exponential Backoff ---

        async function fetchWithBackoff(apiUrl, payload, model) {
            let retries = 3;
            let delay = 1000;
            const apiKey = ""; // API key will be provided by the environment

            while (retries > 0) {
                try {
                    const finalApiUrl = ${apiUrl}?key=${apiKey};
                    const response = await fetch(finalApiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(HTTP error! status: ${response.status});
                    }
                    return await response.json();

                } catch (error) {
                    console.warn(API call failed for ${model}. Retrying in ${delay}ms..., error);
                    retries--;
                    if (retries === 0) throw error;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                }
            }
        }

        async function generateImage(year) {
            const prompt = A photorealistic, cinematic image representing a major news event in the year ${year}. Style: futuristic, high-tech, detailed.;
            const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';
            
            const result = await fetchWithBackoff(apiUrl, payload, 'Imagen 3');

            if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                return result.predictions[0].bytesBase64Encoded;
            } else {
                console.error("Unexpected image API response:", result);
                throw new Error('Image generation failed to return data.');
            }
        }

        async function generateNews(year) {
            const prompt = `
                Generate a single, compelling, and speculative news article from the year ${year}.
                The article should focus on a significant breakthrough in technology, science, or society.
                The tone should be that of a professional news report.
                Provide the output in a JSON object with two keys: "headline" and "body".
                The headline should be catchy and under 15 words.
                The body should be a paragraph between 80 and 120 words.
            `;
            
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "headline": { "type": "STRING" },
                            "body": { "type": "STRING" }
                        },
                        required: ["headline", "body"]
                    }
                }
            };
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

            const result = await fetchWithBackoff(apiUrl, payload, 'Gemini 2.5 Flash');
            
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                try {
                    // The response text is a JSON string, so we parse it
                    return JSON.parse(result.candidates[0].content.parts[0].text);
                } catch (e) {
                    console.error("Failed to parse news content JSON:", e);
                    throw new Error("Invalid format received for news content.");
                }
            } else {
                console.error("Unexpected news API response:", result);
                throw new Error('News generation failed to return content.');
            }
        }
    </script>
</body>
</html>