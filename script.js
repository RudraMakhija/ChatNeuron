



const sendChatBtn= document.querySelector(".chat-input span")
const chatInput= document.querySelector(".chat-input textarea")
const chatBox= document.querySelector(".chatbox")

let userMessage;
const API_URL= "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAFsLEHKrbjzcp-p6ruGHUytUmbB_P-iWc"

const inputInitHeight= chatInput.scrollHeight

const createChatLi= (message, className)=>{
    const chatLi= document.createElement("li")
    chatLi.classList.add("chat", className)

    let chatContent= className === "outgoing" ? `<p></p>` :  ` <span><i class="fa-solid fa-user-astronaut"></i></span><p></p>`
    chatLi.innerHTML= chatContent
    chatLi.querySelector("p").textContent= message
    return chatLi
}


const generateResponse = async (incomingChatLi) => {
    try {
        const messageElement = incomingChatLi.querySelector("p");

        const response = await axios({
            url: API_URL,
            method: "post",
            data: {
                contents: [
                    { parts: [{ text: userMessage }] }
                ]
            }
        });

        messageElement.textContent = response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error fetching response:", error);
        messageElement.classList.add("error");
        messageElement.textContent = "An error occurred while fetching the response.";
    } finally {
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }
};


   
   

const handleChat= ()=>{
    userMessage= chatInput.value.trim()
    if(!userMessage) return
    chatInput.value= ""
    chatInput.style.height= `${inputInitHeight}`

   chatBox.appendChild(createChatLi(userMessage, "outgoing"))
   chatBox.scrollTo(0, chatBox.scrollHeight)


   setTimeout(
    ()=>{
        const incomingChatLi= createChatLi("Generating response...", "incoming")
        chatBox.scrollTo(0, chatBox.scrollHeight)

        chatBox.appendChild(incomingChatLi)
        generateResponse(incomingChatLi)
    }, 600)
}

chatInput.addEventListener("input", ()=>{
    chatInput.style.height= `${inputInitHeight}px`
    chatInput.style.height= `${chatInput.scrollHeight}px`
})


chatInput.addEventListener("keydown", (e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault()
        handleChat()
    } 
})
sendChatBtn.addEventListener("click", handleChat)
