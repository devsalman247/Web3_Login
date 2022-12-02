import { useState, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js";
import { ethers, BigNumber } from "ethers";
import Swal from "sweetalert2";
import Web3 from "web3";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  let defaultUser: any = {};
  const [user, setUser] = useState(defaultUser);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(0);

  const isSignedUp = async (address: string): Promise<void> => {
    let user;

    await fetch(`${VITE_BACKEND_URL}?publicAddress=${address}`)
      .then((response) => response.json())
      .then(
        (retUser: {
          data: {
            status: boolean;
            publicAddress: string | undefined;
            nonce: number | undefined;
          };
        }) => {
          user = { ...retUser.data };
        }
      )
      .catch((err: any) => console.log(err));

    return user;
  };

  const handleSignMessage = async ({
    web3,
    publicAddress,
    nonce,
  }: any): Promise<void> => {
    console.log(web3, publicAddress, nonce);
    const signature = await web3.eth.personal.sign(
      `I am signing my one-time nonce: ${nonce}`,
      publicAddress,
      (err: any, signature: any) => {
        if (err) console.log(err);
        return signature;
      }
    );
    console.log("signature", signature);
    return signature;
  };

  const handleAuthenticate = async ({ publicAddress, signature }: any) => {
    console.log("error in authenticate fn");
    await axios
      .post(`${VITE_BACKEND_URL}/auth`, {
        publicAddress,
        signature,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  async function handleSignUp(): Promise<void> {
    console.log(chainId);
    if (chainId !== 56) {
      Swal.fire({
        position: "center",
        icon: "error",
        title:
          "Wrong chain selected..Please select Binance Smart Chain to connect",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    let provider: any;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    try {
      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
      }
      const web3 = new Web3(provider);
      const userAccount = await web3.eth.getAccounts();
      const signature: string | void = await web3.eth.personal
        .sign("Connecting to Web3!", userAccount[0], "")
        .then(console.log);
      const chainId = await web3.eth.getChainId();
      const account = userAccount[0];
      let ethBalance = await web3.eth.getBalance(account);
      ethBalance = web3.utils.fromWei(ethBalance, "ether");
      const user: any = await isSignedUp(account);
      console.log(user.status);
      if (user.status) {
        console.log("You've already signed up!");
        (Swal as any).fire({
          toast: true,
          icon: "error",
          title: "You've already signed up!",
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast: any) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        return;
      } else {
        console.log("You can sign up.");
        await axios
          .post(`${VITE_BACKEND_URL}/signup`, { publicAddress: account })
          .then(() => {
            (Swal as any).fire({
              toast: true,
              icon: "success",
              title: "Signup successful!",
              position: "bottom",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast: any) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
          })
          // .then((res: any) => {
          //   console.log(res);
          //   return handleSignMessage({
          //     web3,
          //     publicAddress: account,
          //     nonce: res.data.data.nonce,
          //   });
          // })
          // .then((signature) => {
          //   console.log(signature);
          //   handleAuthenticate({ publicAddress: account, signature });
          // })
          .catch((err: any) => console.log(err));
      }

      provider.on("disconnect", async (code: object, reason: object) => {
        window.localStorage.removeItem("metamask");
        await provider.disconnect();
        setUser(defaultUser);
        setIsConnected(false);
      });
    } catch (err: any) {
      if (err.code === 4001) {
        (Swal as any).fire({
          toast: true,
          icon: "error",
          title: "You've to sign message to signup!",
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast: any) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      }
      console.log(err);
    }
  }

  async function handleLoggin() {
    console.log(chainId);
    if (chainId !== 56) {
      Swal.fire({
        position: "center",
        icon: "error",
        title:
          "Wrong chain selected..Please select Binance Smart Chain to connect",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    let provider: any;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    try {
      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
      }
      const web3 = new Web3(provider);
      const userAccount = await web3.eth.getAccounts();
      // await web3.eth.personal
      //   .sign("Connecting to Web3!", userAccount[0], "")
      //   .then(console.log);
      const chainId = await web3.eth.getChainId();
      const account = userAccount[0];
      let ethBalance = await web3.eth.getBalance(account);
      ethBalance = web3.utils.fromWei(ethBalance, "ether");
      const user: any = await isSignedUp(account);
      console.log(user.status);
      if (!user.status) {
        console.log("You've to signup first!");
        (Swal as any).fire({
          toast: true,
          icon: "error",
          title: "You've to signup first!",
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast: any) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        return;
      } else {
        console.log("You can login.");
        await axios
          .post(`${VITE_BACKEND_URL}/login`, { publicAddress: account })
          .then((res: any) => {
            console.log(res);
            return handleSignMessage({
              web3,
              publicAddress: account,
              nonce: res.data.data.nonce,
            });
          })
          .then((signature) => {
            console.log(signature);
            handleAuthenticate({ publicAddress: account, signature });
            (Swal as any).fire({
              toast: true,
              icon: "success",
              title: "Login Successful!",
              position: "bottom",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast: any) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
          })
          .catch((err: any) => {
            if (err.code === 4001) {
              (Swal as any).fire({
                toast: true,
                icon: "error",
                title: "You've to sign message to login!",
                position: "bottom",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast: any) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });
            }
            console.log(err);
          });
      }

      provider.on("disconnect", async (code: object, reason: object) => {
        window.localStorage.removeItem("metamask");
        await provider.disconnect();
        setUser(defaultUser);
        setIsConnected(false);
      });
    } catch (err) {
      console.log(err);
    }
  }

  const onDisconnect = (): void => {
    window.localStorage.removeItem("metamask");
    const walletconnect = localStorage.getItem("walletconnect");
    if (walletconnect) {
      localStorage.removeItem("walletconnect");
    }
    setUser(defaultUser);
    setIsConnected(false);
  };

  async function getChainId(): Promise<void> {
    const web3 = new Web3(window.ethereum);
    const chainId = await web3.eth.getChainId();
    setChainId(chainId);
  }

  useEffect(() => {
    if (chainId !== 56 && chainId !== 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title:
          "Wrong chain selected..Please select Binance Smart Chain to connect",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    console.log(VITE_BACKEND_URL);
  }, [chainId]);

  useEffect(() => {
    function checkConnectedWallet() {
      const userData =
        JSON.parse(localStorage.getItem("metamask") as string) ||
        JSON.parse(localStorage.getItem("walletconnect") as string);
      if (userData != null) {
        setUser({ ...user, ...userData });
        setIsConnected(true);
      }
    }
    getChainId();
    window.ethereum.on("accountsChanged", (accounts: string[]): void => {
      console.log(accounts);
      if (accounts.length === 0) {
        window.localStorage.removeItem("metamask");
        setUser(defaultUser);
        setIsConnected(false);
      }
    });
    window.ethereum.on("chainChanged", (chainId: number): void => {
      getChainId();
    });
    checkConnectedWallet();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {Object.keys(user).length !== 0 ? (
        <>
          <button
            className="mt-2 px-3 py-2 rounded bg-slate-500 text-white focus:outline-none"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </button>
          <div className="mt-4 flex flex-col">
            <div>
              Status : Connected <br />
              Account : {user.account} <br />
              Balance : {user.balance} ETH
            </div>
          </div>
        </>
      ) : (
        <div>
          <button
            className="px-3 py-2 rounded bg-slate-500 text-white focus:outline-none"
            onClick={() => handleLoggin()}
          >
            Login with Metamask
          </button>
          <button
            className="px-3 py-2 ml-2 rounded bg-slate-500 text-white focus:outline-none"
            onClick={() => handleSignUp()}
          >
            SignUp with Metamask
          </button>
          <div className="mt-2">Status : Not Connected</div>
        </div>
      )}
    </div>
  );
}

export default App;
