const progressPercent=document.getElementById("progressPercent")
const progressStep=document.getElementById("progressStep")
const circle=document.querySelector(".circle")
const nextBtn=document.querySelector(".next")
const prevBtn=document.querySelector(".previous")

const pages=["gender.html","age.html","symptoms.html","cure.html"]

let currentPage=window.location.pathname.split("/").pop().toLowerCase()

let currentIndex=pages.indexOf(currentPage)
if(currentIndex===-1) currentIndex=2

function updateProgress(step,total){
    const percent=Math.round(((step+1)/total)*100)
    if(progressPercent) progressPercent.innerText=percent+"%"
    if(progressStep) progressStep.innerText="Step "+(step+1)+"/"+total
    if(circle){
        const degrees=(percent/100)*360
        circle.style.background=`conic-gradient(#ffffff 0deg ${degrees}deg,#b44345 ${degrees}deg 360deg)`
    }
}

updateProgress(currentIndex,4)

const tabs=document.querySelectorAll(".tabs div")

tabs.forEach((tab,index)=>{
    if(index===currentIndex){
        tab.classList.add("active")
    }

    if(index>currentIndex){
        tab.style.opacity="0.4"
        tab.style.cursor="not-allowed"
    }else{
        tab.addEventListener("click",()=>{
            window.location.href=pages[index]
        })
    }
})

if(prevBtn){
    prevBtn.addEventListener("click",()=>{
        if(currentIndex>0){
            window.location.href=pages[currentIndex-1]
        }
    })
}

const container=document.querySelector(".main-common-symptoms")
const input=document.getElementById("symptom")

if(container && input){

    const commonSymptoms=[
    "Headache","Fever","Cough","Cold","Fatigue",
    "Sore throat","Nausea","Vomiting",
    "Body pain","Chest pain","Sensitivity to light"
    ]

    let selectedSymptoms=[]

    function updateNextButton(){
        if(nextBtn) nextBtn.disabled=selectedSymptoms.length===0
    }

    commonSymptoms.forEach(symptom=>{
        const btn=document.createElement("button")
        btn.textContent=symptom
        btn.classList.add("symptom-btn")

        btn.onclick=()=>{
            if(selectedSymptoms.includes(symptom)){
                selectedSymptoms=selectedSymptoms.filter(s=>s!==symptom)
                btn.classList.remove("selected")
            }else{
                selectedSymptoms.push(symptom)
                btn.classList.add("selected")
            }
            input.value=selectedSymptoms.join(", ")
            updateNextButton()
        }

        container.appendChild(btn)
    })

    if(nextBtn){
        nextBtn.addEventListener("click",async()=>{
            if(selectedSymptoms.length===0) return

            nextBtn.disabled=true

            try{
                const response=await fetch(
                    "https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose",
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "X-RapidAPI-Key":"",
                            "X-RapidAPI-Host":"ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com"
                        },
                        body:JSON.stringify({
                            symptoms:selectedSymptoms,
                            patientInfo:{
                                age:25,
                                gender:"male",
                                height:170,
                                weight:65,
                                medicalHistory:[],
                                currentMedications:[],
                                allergies:[],
                                lifestyle:{
                                    smoking:false,
                                    alcohol:"none",
                                    exercise:"moderate",
                                    diet:"balanced"
                                }
                            },
                            lang:"en"
                        })
                    }
                )

                const data=await response.json()
                console.log("API RESPONSE:",data)
                localStorage.setItem("result",JSON.stringify(data))
                window.location.href="cure.html"

            }catch(error){
                console.log(error)
                nextBtn.disabled=false
            }
        })
    }

    updateNextButton()
}
