import axios from "axios";

const endpoint = `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API}`;

const getNFTs = async (owner, contractAddress) => {
  if (owner) {
    let data;
    try {
      if (contractAddress) {
        data = await axios.get(
          `${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`
        );
        data = data.data;
      } else {
        data = await axios.get(`${endpoint}/getNFTs?owner=${owner}`);
        data = data.data;
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
    return data;
  }
};

const getMetadata = async (NFTS) => {
  try {
    const NFTsMetadata = await Promise.allSettled(
      NFTS.map(async (NFT) => {
        let metadata = await axios.get(
          `${endpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`
        );
        metadata = metadata.data;
        let imageUrl;
        console.log("metadata", metadata);
        if (metadata.media[0].uri.gateway.length) {
          imageUrl = metadata.media[0].uri.gateway;
        } else {
          imageUrl = "https://via.placeholder.com/500";
        }

        return {
          id: NFT.id.tokenId,
          contractAddress: NFT.contract.address,
          image: imageUrl,
          title: metadata.metadata.name,
          description: metadata.metadata.description,
          attributes: metadata.metadata.attributes,
        };
      })
    );

    return NFTsMetadata;
  } catch (e) {
    console.log(e);
  }
};

export const fetchNFTs = async (owner, contractAddress, setNFTs) => {
  const data = await getNFTs(owner, contractAddress);
  console.log(data);
  if (data?.ownedNfts?.length) {
    const NFTs = await getMetadata(data?.ownedNfts);
    let fullfilledNFTs = NFTs.filter((NFT) => NFT.status === "fulfilled");
    setNFTs(fullfilledNFTs);
  } else {
    setNFTs(null);
  }
};
