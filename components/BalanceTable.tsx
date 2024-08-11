import React from "react";

interface BalanceTableProps {
  balanceData: any[] | null;
  title: string;
}

export const BalanceTable: React.FC<BalanceTableProps> = ({
  balanceData,
  title,
}) => {
  if (!balanceData || balanceData.length === 0) {
    return <p>No balance data available.</p>;
  }

  return (
    <table className="min-w-full ">
      <thead>
        <tr>
          <th className="py-2">Address</th>
          <th className="py-2">Asset</th>
          <th className="py-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {balanceData.map((item: any, index: number) => (
          <tr key={index}>
            <td className="border px-4 py-2">{item.address}</td>
            <td className="border px-4 py-2">{item.asset}</td>
            <td className="border px-4 py-2">{item.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
