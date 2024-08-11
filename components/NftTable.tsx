import React from "react";

interface NftTableProps {
  nftData: any[];
  title: string;
}

export const NftTable: React.FC<NftTableProps> = ({ nftData, title }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="min-w-full border-collapse mb-8">
        <thead>
          <tr>
            <th className="border px-4 py-2">Chain</th>
            <th className="border px-4 py-2">Wallet Address</th>
            <th className="border px-4 py-2">Token ID</th>
            <th className="border px-4 py-2">Metadata URI</th>
          </tr>
        </thead>
        <tbody>
          {nftData.map((nft: any, index: number) => (
            <tr key={index}>
              <td className="border px-4 py-2">{nft.chain}</td>
              <td className="border px-4 py-2">{nft.address}</td>
              <td className="border px-4 py-2">{nft.tokenId}</td>
              <td className="border px-4 py-2">
                <a
                  href={nft.metadataURI}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {nft.metadataURI}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
