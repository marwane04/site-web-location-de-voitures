
document.getElementById('contactForm').addEventListener('submit', function(event) {
    document.getElementById('send-btn').textContent="Sending... " ;
        event.preventDefault();
        emailjs.sendForm(
            'service_ba0ny18',       
            'template_62mzqcg',
            this,
            'VFEyXWVtFUhjYJcwY'       
        )
        .then(function() {
            document.getElementById('send-btn').textContent="Message Sent " ;
            document.getElementById('fullName').value=" ";
            document.getElementById('email').value="";
            document.getElementById('message').value="";
        }, function(error) {
            console.log('Erreur: ' + error.text);
        });
    });