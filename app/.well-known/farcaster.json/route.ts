function withValidProperties(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return !!value;
    })
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://v0-kiniela-app.vercel.app';
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEzNjUxNTQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwNEFBMGU1ZmQ1YjdmOWVCQzRhMjYxRThDOTA5NjRjMDBFYjk1RDlBIn0",
      payload: "eyJkb21haW4iOiJ2MC1raW5pZWxhLWFwcC52ZXJjZWwuYXBwIn0",
      signature: "526mC3kixxVKw44XIjuZ/jYAlAaL3DQYPuLMEsr85iUlDntyTSJpq0V/eOXYWB2lQcMiJIeRREOhhLPCMeHhkxw="
    },
    baseBuilder: {
      allowedAddresses: ["0x1615Ad56c1F19B2394cf36496F99A29D4E21932A"],
      smartWalletOnly: false,
      supportedChains: ["base"],
      enableSmartWallet: true,
      enableRegularWallet: true,
      enablePasskey: true, // Habilitar passkeys para Smart Wallets
      smartWalletConfig: {
        enableAccountAbstraction: true,
        enablePaymaster: true,
        enableBatchTransactions: true,
      },
    },
    miniapp: {
      version: "1",
      name: "Kiniela",
      homeUrl: `${URL}`,
      iconUrl: `${URL}/kiniela_logo.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Prediction Markets",
      description: "A fast, fun way to create and bet on prediction markets on Base.",
      screenshotUrls: [
        `${URL}/screenshot1.png`,
        `${URL}/screenshot2.png`,
        `${URL}/screenshot3.png`
      ],
      primaryCategory: "social",
      tags: ["prediction", "markets", "base", "betting", "social"],
      heroImageUrl: `${URL}/og-image.png`,
      tagline: "Bet on anything",
      ogTitle: "Kiniela - Prediction Markets",
      ogDescription: "Create and bet on prediction markets with friends on Base.",
      ogImageUrl: `${URL}/og-image.png`,
      noindex: false
    }
  };

  return Response.json(withValidProperties(manifest));
}


