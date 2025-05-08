import { useEffect } from "react";

const SubmitForm = ({ formHtml }: { formHtml: string }) => {
  useEffect(() => {
    // Delay execution to allow the form to be added to the DOM
    setTimeout(() => {
      const form = document.getElementById("payment_post") as HTMLFormElement;
      console.log("in submit");
      if (form) form.submit(); // Auto-submit the form
    }, 500);
  }, []);

  // Remove unnecessary escape characters if they exist
  const sanitizedFormHtml = formHtml.replace(/\\/g, ""); // Removes all backslashes

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedFormHtml }} />
  );
};

export default SubmitForm;
