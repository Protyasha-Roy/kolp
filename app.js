const errorElement = document.getElementById('error');

function toggleQueries() {
    const queryInfo = document.getElementById('queryInfo');
    queryInfo.style.display = (queryInfo.style.display === 'block') ? 'none' : 'block';
}

const backButton = document.getElementById('backButton'); // Assuming there's a back button in the HTML 
let queryHistory = []; let currentQueryIndex = -1;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const defineFormat = {
    searchedText: "hello",
    definition: "Hello' an [expression] or [gesture] of greeting —used [interjectionally] in greeting, in answering the [telephone], or to express [surprise]. examples: hello there, waved hello.",
    source: "https://www.merriam-webster.com/dictionary/hello",
    sourceTitle: "Merriam-Webster"
}

const questionFormat = {
    searchedText: "What is the latest on the COVID-19 vaccine development?",
    answer: "The development of [COVID-19] vaccines has reached new milestones, with [boosters] being recommended for high-risk populations. Companies like [Pfizer] and [Moderna] have developed vaccines that are being distributed globally. New [variants] of the virus are being monitored for vaccine efficacy.",
    source: "https://www.bbc.com/news/health-56003351",
    sourceTitle: "BBC News"
}

const pdfFormat = {
    searchedText: "A Brief History of Time by Stephen Hawking",
    links: [
        {title: "A Brief History of Time by Stephen Hawking", url: "https://example.com/abriefhistoryoftime.pdf"},
        {title: "A Brief History of Time (PDF)", url: "https://anotherexample.com/briefhistory.pdf"}
    ]
}

const weatherFormat = {
    searchedText: "Tokyo",
    source: "https://www.weatherapi.com",
    sourceTitle: "WeatherAPI",
    weather: {
        temperature: "20°C",
        humidity: "60%",
        conditions: "sunny"
    }
}

const timeFormat = {
    searchedText:"Tokyo",
    time: "The time in Tokyo is currently 10:00 AM.",
    source: "https://www.timeapi.io",
    sourceTitle: "TimeAPI"
}

const generalFormat = {
    searchedText: "What is the capital of Japan?",
    answer: "The capital of Japan is Tokyo.",
    source: "https://www.japan.travel",
    sourceTitle: "Japan Travel"
}

// Event listener for pressing Enter
searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const inputValue = event.target.value;
        if(inputValue.trim() !== ''){
            handleSearch(inputValue);  // Call handleSearch on pressing Enter
        }
    }
});

// Event listener for clicking the search button
searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value;
    if(inputValue.trim() !== ''){
        handleSearch(inputValue);  // Call handleSearch on clicking the search button
    }
});

// Function to update back button visibility 
function updateBackButton() { backButton.style.display = currentQueryIndex > 0 ? 'block' : 'none'; }

// Recursive handleSearch function
async function handleSearch(query) {
    const errorElement = document.getElementById('error');
    const prefixes = ['define:', 'question:', 'pdf:', 'weather:', 'time:'];
    let prefix = prefixes.find(prefix => query.toLowerCase().startsWith(prefix.toLowerCase()));

    if (prefix) {
        const searchQuery = query.substring(prefix.length).trim();
        let prompt;

        // Handling the different types of queries
        switch (prefix) {
            case 'define:':
                prompt = `Provide a concise and precise definition for the term ${query} from a reliable dictionary (such as Merriam-Webster, Oxford, Britannica etc.). The definition should be 1-5 lines long and include the source of the definition. The response should be strictly formatted as follows in json format:

                    searchedText: ${query}
                    definition: {definition}
                    source: {source_url}
                    sourceTitle: {source_title}
                    
                    For the definition, identify words in the definition that are not in the original query and put them inside square brackets. Example: ${defineFormat.definition}`;
                break;

            case 'question:':
                prompt = `Provide a concise and accurate answer to the question ${query} by searching from reliable sources based on the type of question. The system should identify the category of the question and use relevant sources for that category. Below are the categories and suggested sources:

                    1. Technology and programming: Wikipedia,TechCrunch, Wired, Stack Overflow, GitHub, StackExchange, Reddit (r/technology), Kaggle, IEEE Xplore
                    2. Science: Wikipedia, Nature, ScienceDirect, PubMed, ResearchGate, Scientific American
                    3. Physics: Wikipedia, arXiv, CERN, American Physical Society, Springer, APS Physics
                    4. Chemistry: Wikipedia, ScienceDirect, Journal of the American Chemical Society, Royal Society of Chemistry
                    5. Mathematics: Wikipedia, Math Stack Exchange, Wolfram MathWorld, Springer, Google Scholar, MathSciNet
                    6. History: Wikipedia, Britannica, History Channel, JSTOR, National Archives
                    7. Geography: Wikipedia, National Geographic, USGS, CIA World Factbook, Google Earth
                    8. Health: WebMD, Mayo Clinic, PubMed, CDC, NIH, Healthline
                    9. Literature: Wikipedia, JSTOR, Literary Journals, Google Books, Oxford English Dictionary
                    10. Politics: Wikipedia, BBC, CNN, The New York Times, Reuters, Politico, The Guardian
                    11. Business & Finance: Wikipedia, Investopedia, Bloomberg, Business Insider, Wall Street Journal, Forbes
                    12. Sports: Wikipedia, ESPN, Bleacher Report, Sports Illustrated, Official Team Websites
                    13. Pop Culture: Wikipedia, IMDB, Rolling Stone, Variety, BuzzFeed, Entertainment Weekly
                    14. Social Issues: Wikipedia, The Guardian, BBC, Pew Research, Amnesty International, Human Rights Watch
                    15. General Knowledge: Wikipedia, Quora, Reddit, Stack Exchange, News Sites (CNN, BBC, etc.)
                    16. Philosophy: Stanford Encyclopedia of Philosophy, Wikipedia, JSTOR, Philosophy Now
                    17. Music: Wikipedia, Rolling Stone, Billboard, IMDB (for soundtracks), AllMusic, Music Theory (musictheory.net)
                    18. Dance: Wikipedia, Dance Magazine, JSTOR, Dance Research Journal, Ballet.co
                    19. Art: Wikipedia, The Met, Tate, The Louvre, JSTOR, ArtForum, National Gallery of Art
                    20. Psychology: Wikipedia, APA PsycNet, JSTOR, Psychology Today, Google Scholar
                    21. Sociology: Wikipedia, JSTOR, Sage Journals, SSRN, American Sociological Association
                    22. Engineering: IEEE Xplore, ASME, ScienceDirect, Springer, MIT OpenCourseWare
                    23. Law: Wikipedia, Legal Information Institute (Cornell), Justia, JSTOR, LexisNexis
                    24. Environmental Science: Wikipedia, ScienceDirect, EPA, National Geographic, Nature
                    25. Agriculture: Wikipedia, JSTOR, PubMed, USDA, FAO
                    26. News: BBC, CNN, Reuters, The New York Times, The Guardian, Al Jazeera, Bloomberg, NPR etc local news sites

                    The answer should be concise and directly address the question with relevant information from the appropriate sources. Format the response as follows in json format:

                    searchedText: ${query}
                    answer: {answer}
                    source: {source_url}
                    sourceTitle: {source_title}
                    Instructions:
                    Be specific, concise, and informative.
                    For the answer, identify words in the answer that are not in the original query and put them inside square brackets. Example: ${questionFormat.answer}
                    Make sure to use the sources that you get the answers from, do not make up any information and always provide the source url from which you got the answer. Do not use any other sources.`;
                break;

            case 'pdf:':
                prompt = `Make a web search to find direct download links for PDFs based on the user's query from Google. The query can be a title, DOI, book ID, author name, or subject/topic. 

                    1. **If the query is a DOI or research paper-related**, search from sources like Sci-Hub, research journals, and other scholarly repositories.
                    2. **If the query is a book title, author name, or related to books**, search from sources like Libgen.is, Project Gutenberg, Internet Archive, Open Library, Scribd, academia.edu, or GitHub repositories.
                    3. **If the query is a subject or topic**, search for books, research papers, or relevant resources related to that subject/topic. For example, if the user enters "Machine Learning," search for books, research papers, or materials on "Machine Learning."

                    Provide all relevant links, and each link must directly lead to a downloadable PDF file. Here is the user's query: ${query}. Structure the response in the following format as json:

                    searchedText: ${query}
                    links: [
                    {title: "{title of the resource}", url: "{direct pdf url}"},
                    {title: "{title of the resource}", url: "{direct pdf url}"}
                    ]

                    Use reliable and free sources. Include only URLs that directly download PDFs. Avoid providing URLs that require further navigation.

                    Example:
                    For a book:
                    searchedText: A Brief History of Time by Stephen Hawking
                    links: [
                    {title: "A Brief History of Time by Stephen Hawking", url: "https://example.com/abriefhistoryoftime.pdf"},
                    {title: "A Brief History of Time (PDF)", url: "https://anotherexample.com/briefhistory.pdf"}
                    ]

                    For DOI or research papers:
                    searchedText: 10.1000/j.jmb.2010.08.005
                    links: [
                    {title: "Research Paper Title from Sci-Hub", url: "https://sci-hub.se/download/10.1000/j.jmb.2010.08.005.pdf"},
                    {title: "Research Paper Title from Journal Archive", url: "https://journalarchive.org/paper/download/10.1000/j.jmb.2010.08.005.pdf"}
                    ]
                    
                    For topic/subject:
                    searchedText: Machine Learning
                    links: [
                    {title: "Machine Learning Basics", url: "https://example.com/machinelearning.pdf"},
                    {title: "Advanced Machine Learning Techniques", url: "https://example.com/advancedmachinelearning.pdf"}
                    ]

                    Instructions:
                    Make sure not to give links that are not working or not available. Always give links that are working and available.
                    Search from the internet and give the links that are actually available.
                    No dummy links.`;
                break;

            case 'weather:':
                prompt = `Get the current weather for ${searchQuery}. Provide the temperature, humidity, and conditions. Use the weather api to get the instant weather. Or use sources like weatherapi.com, openweathermap.org, etc. Strictly format the response in the following format as json:

                searchedText: ${query}
                weather: {
                    temperature: {temperature}
                    humidity: {humidity}
                    conditions: {conditions}
                }
                source: {source_url}
                sourceTitle: {source_title}
                `;
                break;

            case 'time:':
                prompt = `Get the current time for ${searchQuery}. Provide the time in a 12-hour format. Use api or other method to get the correct time for the query. Make sure to strictly follow this format in json:

                searchedText: ${query}
                time: {time}
                source: {source_url}
                sourceTitle: {source_title}
                `;
                break;

            default:
                console.log('No valid prefix found.');
                return;
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyDTz-JMi3hpq_6KV2x077ELWw1Krtvy4cs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if(prefix==='define:'){
                const data = await response.json();
                const responseText = data.candidates[0].content.parts[0].text.replace(/```/g, '').replace(/json/g, '').trim();
                const jsonResponse = JSON.parse(responseText);
                const searchedText = jsonResponse.searchedText;
                const definition = jsonResponse.definition;
                const source = jsonResponse.source.replace(/"/g, ''); // Remove quotes around the source
                const sourceTitle = jsonResponse.sourceTitle;
    
                if (typeof definition !== 'string') {
                    throw new Error('Definition is not a string');
                }
                
                
    
                const resultsDiv = document.getElementById('results');
                const formattedDefinition = definition.replace(/\[(.*?)\]/g, (match, p1) => {
                    return `<a href="#" style="color: blue;" onclick="handleWordClick('${p1}');">${p1}</a>`; // This ensures recursive search
                });
    
                resultsDiv.innerHTML = `
                    <h2>${searchQuery}</h2>
                    <p><strong>Definition:</strong> ${formattedDefinition}</p>
                    <p><strong>Source:</strong> <a href="${source}" target="_blank" style="color: blue;">${sourceTitle}</a></p>
                `;
            } else if(prefix==='question:'){
                const data = await response.json();
                const responseText = data.candidates[0].content.parts[0].text.trim();

                let jsonResponse;
                try {
                    // Remove any markdown formatting (like ```json) from the responseText
                    const cleanedResponseText = responseText.replace(/```json|```/g, '').trim();
                    
                    // Directly parse the cleaned responseText since it is now in valid JSON format
                    jsonResponse = JSON.parse(cleanedResponseText);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    throw new Error('Received invalid JSON response');
                }

                const searchedText = jsonResponse.searchedText;
                const answer = jsonResponse.answer;
                const source = jsonResponse.source.replace(/"/g, ''); // Remove quotes around the source
                const sourceTitle = jsonResponse.sourceTitle;

                if (typeof answer !== 'string') {
                    throw new Error('Answer is not a string');
                }

                const resultsDiv = document.getElementById('results');
                const formattedAnswer = answer.replace(/\[(.*?)\]/g, (match, p1) => {
                    return `<a href="#" style="color: blue;" onclick="handleWordClick('${p1}');">${p1}</a>`; // This ensures recursive search
                });

                resultsDiv.innerHTML = `
                    <h2>${searchQuery}</h2>
                    <p><strong>Answer:</strong> ${formattedAnswer}</p>
                    <p><strong>Source:</strong> <a href="${source}" target="_blank" style="color: blue;">${sourceTitle}</a></p>
                `;
            } else if(prefix==='pdf:'){
                const data = await response.json();
                const responseText = data.candidates[0].content.parts[0].text.replace(/```/g, '').replace(/json/g, '').trim();
                const jsonResponse = JSON.parse(responseText);
                const searchedText = jsonResponse.searchedText;
                const links = jsonResponse.links;
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <h2>${searchQuery}</h2>
                    <ul>
                        ${links.map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`).join('')}
                    </ul>
                `;
            } else if(prefix==='weather:'){
                const data = await response.json();
                const responseText = data.candidates[0].content.parts[0].text.replace(/```/g, '').replace(/json/g, '').trim();
                // Extract the relevant fields directly from the response
                const jsonResponse = JSON.parse(responseText);
                const searchedText = jsonResponse.searchedText;
                const weather = `Temperature: ${jsonResponse.weather.temperature}, Humidity: ${jsonResponse.weather.humidity}, Conditions: ${jsonResponse.weather.conditions}`;
                const source = jsonResponse.source; // No need to remove quotes as it's already a string
                const sourceTitle = jsonResponse.sourceTitle;

                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <h2>${searchedText}</h2>
                    <p><strong>Weather:</strong> ${weather}</p>
                    <p><strong>Source:</strong> <a href="${source}" target="_blank" style="color: blue;">${sourceTitle}</a></p>
                `;

            } else if(prefix==='time:'){
                const data = await response.json();
                const responseText = data.candidates[0].content.parts[0].text.replace(/```/g, '').replace(/json/g, '').trim();
                const jsonResponse = JSON.parse(responseText);
                const searchedText = jsonResponse.searchedText;
                const time = jsonResponse.time;
                const source = jsonResponse.source.replace(/"/g, ''); // Remove quotes around the source
                const sourceTitle = jsonResponse.sourceTitle;

                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <h2>${searchQuery}</h2>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Source:</strong> <a href="${source}" target="_blank" style="color: blue;">${sourceTitle}</a></p>
                `;
            }

            // After successful search, update query history 
            if (currentQueryIndex === -1 || queryHistory[currentQueryIndex] !== query) { queryHistory.push(query); currentQueryIndex++; } updateBackButton();
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } catch (error) {
            console.error('Error fetching data:', error);
            errorElement.style.display = 'block';
            errorElement.textContent = 'An error occurred while fetching data. Please try again later.';
        }
    } else {
        try{
            const prompt = `provide a concise and accurate answer to the question/term/search ${query} by searching from reliable and related sources. The system should identify the category of the question/term/search and use relevant sources for that category. Below are the categories and suggested sources: wikipedia, google scholar, arxiv, research papers, journals, books, etc. You must follow this format strictly in json format:
            
            searchedText: ${query}
            answer: {answer}
            source: {source_url}
            sourceTitle: {source_title}

            Instructions:
            Be specific, concise, and informative.
            For the answer, identify words in the answer that are not in the original query and put them inside square brackets. Example: ${questionFormat.answer}
            Make sure to use the sources that you get the answers from, do not make up any information and always provide the source url from which you got the answer. Do not use any other sources.
            `

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyDTz-JMi3hpq_6KV2x077ELWw1Krtvy4cs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            
            const data = await response.json();
            const responseText = data.candidates[0].content.parts[0].text.replace(/```/g, '').replace(/json/g, '').trim();
            const jsonResponse = JSON.parse(responseText);
            const searchedText = jsonResponse.searchedText;
            const answer = jsonResponse.answer;
            const source = jsonResponse.source.replace(/"/g, ''); // Remove quotes around the source
            const sourceTitle = jsonResponse.sourceTitle;
        
            if (typeof answer !== 'string') {
                throw new Error('Answer is not a string');
            }
                    
                    
        
            const resultsDiv = document.getElementById('results');
            const formattedAnswer = answer.replace(/\[(.*?)\]/g, (match, p1) => {
                return `<a href="#" style="color: blue;" onclick="handleWordClick('${p1}');">${p1}</a>`; // This ensures recursive search
            });
        
            resultsDiv.innerHTML = `
                <h2>${query}</h2>
                <p><strong>Answer:</strong> ${formattedAnswer}</p>
                <p><strong>Source:</strong> <a href="${source}" target="_blank" style="color: blue;">${sourceTitle}</a></p>
            `;
        } catch(error){
            console.log('No valid prefix found.');
            errorElement.style.display = 'block';
            errorElement.textContent = 'Please use a valid prefix. Click on prefixes to see available queries.';
        } 
}
}

// Back button functionality 
backButton.addEventListener('click', () => { if (currentQueryIndex > 0) { 
    currentQueryIndex--; 
    const previousQuery = queryHistory[currentQueryIndex]; 
    searchInput.value = previousQuery; 
    handleSearch(previousQuery); // Trigger search for previous query 
    updateBackButton(); // Update back button visibility 
} });


// The recursive click handler
function handleWordClick(word) {
    document.getElementById('searchInput').value=`define: ${word}`;

    // Trigger the search again after updating the input field
    handleSearch(`define: ${word}`);
}