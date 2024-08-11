"use client";
import { BalanceTable } from "@/components/BalanceTable";
import { InputForm } from "@/components/InputForm";
import { Loader } from "@/components/Loader";
import { NftTable } from "@/components/NftTable";
import { API_URL, TITLE } from "@/constants";
import axios from "axios";
import { validate } from "bitcoin-address-validation";
import { useCallback, useEffect, useState } from "react";
import { isAddress } from "viem";

export default function Home() {
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
      setApiError(null);
      const response = await axios.request({
        method: "POST",
        url: API_URL,
        data: {
          addresses,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching balances:", error);
      setApiError("Please try again after some time. Something went wrong.");
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
      {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
      {balances && Object.keys(balances).length > 0 && (
        <>
          {Object.keys(balances).map((key) => (
            <div key={key}>
              {balances[key]?.balance?.data && (
                <BalanceTable
                  balanceData={balances[key].balance.data}
                  title={`${key} Balance`}
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
