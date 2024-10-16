import { getApiKey } from "@/queries/getApiKey";
import InputUrl from "./InputUrl";
import TopNav from "./TopNav";

async function Main() {
  const userApi = await getApiKey();
  const apiKey = userApi?.apiKey || "";

  return (
    <div className="container pb-14 ">
      <TopNav apiKey={apiKey} />

      {apiKey && (
        <div className="lg:w-[86%] mt-10 mx-auto">
          {/* Unfiltered stocks url */}
          <InputUrl
            label={`Unfiltered stocks`}
            apiUrl={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/${
              apiKey || "<apiKey>"
            }/cashquiver/unfiltered_stocks`}
          />
        </div>
      )}
    </div>
  );
}

export default Main;
