import React, { useState, useEffect } from "react";
import { Account } from "../interfaces/Account";
import { ethers } from "ethers";
import { mumbai,aah } from "../interfaces/Chain";
import { sendToken } from "../wallet-utils/TransactionUtils";

interface AccountDetailProps {
  account: Account;
}

const AccountDetails: React.FC<AccountDetailProps> = ({ account }) => {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(account.balance);
  const [networkResponse, setNetworkResponse] = useState<{
    status: null | "pending" | "complete" | "error";
    message: string | React.ReactElement;
  }>({
    status: null,
    message: "",
  });

  const fetchData = async () => {
    const provider = new ethers.providers.JsonRpcProvider(aah.rpcUrl);
    let accountBalance = await provider.getBalance(account.address);
    setBalance(
      String(formatEthFunc(ethers.utils.formatEther(accountBalance)))
      // String(accountBalance)
    );
  };

  function formatEthFunc(value: string, decimalPlaces: number = 2) {
    return +parseFloat(value).toFixed(decimalPlaces);
  }

  useEffect(() => {
    fetchData();
  }, [account.address]);

  const handleDestinationAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDestinationAddress(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number.parseFloat(e.target.value));
  };

  const transfer = async () => {
    setNetworkResponse({
      status: "pending",
      message: "",
    });

    try {
      const { receipt } = await sendToken(
        amount,
        account.address,
        destinationAddress,
        account.privateKey
      );

      if (receipt.status === 1) {
        setNetworkResponse({
          status: "complete",
          message: (
            <p>
              Transfer complete!{" "}
              <a
                href={`${aah.blockExplorerUrl}/tx/${receipt.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View transaction
              </a>
            </p>
          ),
        });
        return receipt;
      } else {
        console.log(`Failed to send ${receipt}`);
        // Set the network response status to "error" and the message to the receipt
        setNetworkResponse({
          status: "error",
          message: JSON.stringify(receipt),
        });
        return { receipt };
      }
    } catch (error: any) {
      console.error(error);
      setNetworkResponse({
        status: "error",
        message: error.reason || JSON.stringify(error),
      });
    }
  };

  return (
    <div className="">
      <div>
        <h4 className="text-gray-900 font-medium">Address: </h4>
        <a
          target="blank"
          href={`https://exp.c4ex.net/address/${account.address}`}
          className="text-blue-500 hover:text-blue-600  cursor-pointer"
        >
          {account.address}
        </a>
        <br />
        <span className="text-gray-900 font-medium">Balance: </span>
        {balance} AAH
      </div>

      <div className="my-2">
        <label htmlFor="" className="text-gray-900 font-medium">
          Destination Address:
        </label>
        <input
          type="text"
          value={destinationAddress}
          onChange={handleDestinationAddressChange}
          className="border"
        />
      </div>

      <div>
        <label htmlFor="" className="text-gray-900 font-medium">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="border"
        />
      </div>

      <button
        className="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 m-2"
        type="button"
        onClick={transfer}
        disabled={!amount || networkResponse.status === "pending"}
      >
        Send {amount} AAH
      </button>

      {networkResponse.status && (
        <>
          {networkResponse.status === "pending" && (
            <p>Transfer is pending...</p>
          )}
          {networkResponse.status === "complete" && (
            <p>{networkResponse.message}</p>
          )}
          {networkResponse.status === "error" && (
            <p>
              Error occurred while transferring tokens:{" "}
              {networkResponse.message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AccountDetails;
