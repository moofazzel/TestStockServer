"use client";

import { generateApiKeyAction } from "@/actions/generateApiKeyAction";
import Swal from "sweetalert2";

const GenerateNewApiKey = () => {
  // Generate new key alert
  const handleGenerateNewKeyAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your old key will be replaced by the new key",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await generateApiKeyAction();
        if (res?.success) {
          Swal.fire("Success!", "New key added");
        } else {
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };
  return (
    <button
      onClick={() => handleGenerateNewKeyAlert()}
      type="button"
      className="max-w-[200px] w-full text-gray-900 bg-white border border-black focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 lg:ml-2 mt-3 md:mt-5 lg:mt-0"
    >
      Generate New Key
    </button>
  );
};

export default GenerateNewApiKey;
