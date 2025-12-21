
emailjs.init("VFEyXWVtFUhjYJcwY");

/**
 * @param {string} destination 
 * @param {string} subject 
 * @param {string} message 
 */
export function sendEmail(destination, subject, message) {
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
