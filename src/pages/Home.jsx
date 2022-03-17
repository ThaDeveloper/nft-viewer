import { useState, useEffect } from "react";
import NftCard from "../components/nftcard";
import { fetchNFTs } from "../utils/fetchNFTs";
import { useAccount, useConnect } from "wagmi";
import { ClipboardIcon } from "@heroicons/react/outline";

const Explore = () => {
  const [owner, setOwner] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [NFTs, setNFTs] = useState("");
  const [activeTabId, setActiveTabId] = useState(0);
  const [{ data: accountData }, disconnect] = useAccount();
  const address = accountData?.address;
  const [{ data }, connect] = useConnect();

  const handleClick = (id) => {
    setActiveTabId(id);
  };

  const tabs = ["Enter Address", "Connect"];

  const activeTabStyle = (id) => {
    if (id === activeTabId) {
      return "dark:bg-gray-800 active";
    } else {
      return "dark:hover:bg-gray-800";
    }
  };

  useEffect(() => {
    if (address) {
      setOwner(address);
    }
    setNFTs([]);
  }, [address]);

  return (
    <div>
      <header className=" py-24  mb-12 w-full alchemy">
        <div className="flex-grow flex justify-end mr-12 mb-12"></div>
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8 text-white text-center">
            <h1 className="text-5xl  font-bold font-body mb-2">NFT Viewer</h1>
            <p>Fecth NFTs by owner and contract address </p>
          </div>
          <ul className="flex flex-wrap border-b dark:border-gray-600 mb-6">
            {tabs.map((tab, id) => (
              <li class="mr-2">
                <span
                  key={tab}
                  className={`inline-block py-4 px-4 cursor-pointer text-sm font-medium text-center text-white rounded-t-lg ${activeTabStyle(
                    id
                  )}`}
                  data-cell-index="2"
                  onClick={() => handleClick(id)}
                >
                  {tab}
                </span>
              </li>
            ))}
          </ul>
          {activeTabId === 0 ? (
            <div className="flex flex-col items-center justify-center mb-4 w-2/6 gap-y-2 ">
              <input
                className="border rounded-sm focus:outline-none py-2 px-3 w-full"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter your wallet address"
              ></input>
              <input
                className="focus:outline-none rounded-sm py-2 px-3 w-full"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Enter NFT Contract address (optional)"
              ></input>
            </div>
          ) : accountData ? (
            <div className="flex items-center mb-5">
              <div className="flex mr-4 text-white gap-4">
                <div className="flex items-center">
                  <p className="">{`${[...accountData.address]
                    .splice(0, 6)
                    .join("")}...${[...accountData.address]
                    .splice(37)
                    .join("")}`}</p>
                  <ClipboardIcon
                    onClick={() =>
                      navigator.clipboard.writeText(accountData.address)
                    }
                    className="h-4 w-4 -mt-2 text-slate-200 cursor-pointer"
                  ></ClipboardIcon>
                </div>
              </div>
              <button
                className=" py-2 px-4 rounded-lg bg-white mr-4"
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            data.connectors.map((x) => (
              <div className="w-2/6 mb-5">
                <button
                  className="py-3 w-full bg-white rounded-sm hover:bg-slate-100"
                  disabled={!x.ready}
                  key={x.id}
                  onClick={() => {
                    connect(x);
                  }}
                >
                  {x.name}
                  {!x.ready && " (unsupported)"}
                </button>
              </div>
            ))
          )}
          <div className="w-2/6 flex justify-center">
            <button
              className="py-3 bg-white rounded-sm w-full hover:bg-slate-100"
              onClick={() => {
                fetchNFTs(owner, contractAddress, setNFTs);
              }}
            >
              Fetch
            </button>
            <div className="flex-grow flex justify-end mt-4 mr-12 -mb-20"></div>
          </div>
        </div>
      </header>

      <section className="flex flex-wrap justify-center">
        {NFTs ? (
          NFTs.map((NFT) => {
            return (
              <NftCard
                key={NFT.value.id + NFT.value.contractAddress}
                image={NFT.value.image}
                id={NFT.value.id}
                title={NFT.value.title}
                description={NFT.value.description}
                address={NFT.value.contractAddress}
                attributes={NFT.value.attributes}
              ></NftCard>
            );
          })
        ) : (
          <div>No NFTs found</div>
        )}
      </section>
    </div>
  );
};

export default Explore;
