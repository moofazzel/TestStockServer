import CopyClipboard from "./CopyClipboard";
import GenerateNewApiKey from "./GenerateNewApiKey";
import { ServerLogout } from "./ServerLogout";

async function TopNav({ apiKey }: { apiKey: string }) {
  const loading = false;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* top nav */}
      <div className="px-4 py-5">
        <div className="relative flex items-center justify-between">
          <p className="inline-flex items-center">
            <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
              Stock Server
            </span>
          </p>
          <ul className="flex items-center hidden space-x-8 lg:flex">
            <li>
              <ServerLogout />
            </li>
          </ul>
        </div>
      </div>

      {/* api keys */}
      <div className="items-center justify-center my-6 lg:flex">
        {apiKey ? (
          <div className="items-center justify-center w-full lg:flex ">
            <div className="w-full max-w-[250px]">
              <label
                className="block pr-4 mb-2 font-bold text-gray-500 md:text-right md:mb-0"
                htmlFor="inline-full-name"
              >
                Your Api Key:
              </label>
            </div>

            <div className="flex w-full">
              <input
                className="w-full px-4 py-2 leading-tight text-gray-700 border border-black rounded appearance-none focus:outline-none focus:bg-white focus:border-grey-500 focus:border-2"
                type="text"
                value={apiKey || " "}
                readOnly
              />

              <CopyClipboard text={apiKey} />
            </div>
          </div>
        ) : (
          <h3 className="font-semibold text-xl pr-10">
            Please generate api key first
          </h3>
        )}

        <GenerateNewApiKey />
      </div>
    </>
  );
}

export default TopNav;
