import { createConfig, http } from "wagmi";
import { base, baseGoerli } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  autoConnect: true,
  connectors: [
    coinbaseWallet({
      chains: [base, baseGoerli],
      options: {
        appName: "EventX",
      },
    }),
  ],
  chains: [base, baseGoerli],
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http(),
  },
});
