
emailjs.init("VFEyXWVtFUhjYJcwY");

/**
 * @param {string} destination 
 * @param {string} subject 
 * @param {string} message 
 */
export function sendContactEmail(destination, subject, message) {
  return emailjs.send(
    "service_ba0ny18",   
    "template_62mzqcg",
    {
      to_email: destination,
      subject: subject,
      message: message
    }
  );
}

export function sendConfirmationEmail(templateParams) {
    return emailjs.send(
        "service_ba0ny18",
        "template_pvu9rri",
        templateParams

    )
}
