import { sendEmail } from "./emailService.js";

document.getElementById('contactForm').addEventListener('submit', function(event) {
    document.getElementById('send-btn').textContent="Sending... " ;
        event.preventDefault();
        const destination ="yahyabachri433@gmail.com";
        const user_email=document.getElementById('email').value;
        const subject =document.getElementById('fullName').value;
        const message=document.getElementById('message').value;
        sendEmail(destination,subject,message)
        .then(function() {
            document.getElementById('send-btn').textContent="Message Sent " ;
            document.getElementById('fullName').value=" ";
            document.getElementById('email').value="";
            document.getElementById('message').value="";
        }, function(error) {
            console.log('Erreur: ' + error.text);
        });
    });