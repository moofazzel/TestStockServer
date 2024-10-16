import CopyClipboard from "./CopyClipboard";

function InputUrl({ label, apiUrl }: { label: string; apiUrl: string }) {
  return (
    <div className="items-center gap-3 my-6 md:flex">
      <div className="w-full max-w-[150px]">
        <label
          className={`  block p-2 mb-2 font-bold text-gray-500 capitalize md:mb-0 `}
          htmlFor="inline-full-name"
        >
          <span>{label}</span>
        </label>
      </div>
      <div className="flex max-w-[73%] w-full">
        <input
          className={`  w-full px-4 py-2 leading-tight text-gray-700 border border-black rounded appearance-none focus:outline-none focus:bg-white focus:border-grey-500 focus:border-2 `}
          type="text"
          value={apiUrl || " "}
          readOnly
        />

        <CopyClipboard text={apiUrl} />
      </div>
    </div>
  );
}

export default InputUrl;
