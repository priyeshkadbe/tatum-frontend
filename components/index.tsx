"use client";
import { TITLE } from "@/constants";
import axios from "axios";
import { validate } from "bitcoin-address-validation";
import { useCallback, useEffect, useState } from "react";
import { isAddress } from "viem";
import { BalanceTable } from "./BalanceTable";
import { InputForm } from "./InputForm";
import { Loader } from "./Loader";
import { NftTable } from "./NftTable";

export default function Home() {
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddressInput(e.target.value);
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!addressInput.trim()) {
        setErrors([]);
        return;
      }

      const addresses = addressInput.trim().split(" ");
      const newErrors: string[] = [];

      addresses.forEach((address) => {
        if (!isAddress(address) && !validate(address)) {
          newErrors.push(`"${address}" is not a valid address.`);
        }
      });

      if (
        newErrors.length !== errors.length ||
        newErrors.join() !== errors.join()
      ) {
        setErrors(newErrors);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [addressInput, errors]);

  const fetchBalances = async (addresses: string[]): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await axios.request({
        method: "POST",
        url: "http://localhost:8000/api/v1/balances",
        data: {
          addresses,
        },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching balances:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (errors.length === 0 && addressInput.trim()) {
      const addressArray = addressInput.trim().split(" ");
      setAddressArray(addressArray);
      fetchBalances(addressArray)
        .then((data) => {
          setBalances(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Invalid addresses:", errors);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-y-4 p-24">
      <h1>{TITLE}</h1>
      <InputForm
        addressInput={addressInput}
        errors={errors}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      {isLoading && <Loader />}
      {balances && (
        <>
          {Object.keys(balances).map((key) => (
            <div key={key}>
              {balances[key]?.balance?.data && (
                <BalanceTable
                  balanceData={balances[key].balance.data}
                  title={`${key} Balances`}
                />
              )}
              {balances[key]?.nfts?.data && (
                <NftTable
                  nftData={balances[key].nfts.data}
                  title={`${key} NFTs`}
                />
              )}
            </div>
          ))}
        </>
      )}
    </main>
  );
}
