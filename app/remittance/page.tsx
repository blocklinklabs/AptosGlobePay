import P2PRemittance from "@/components/P2PRemittance";
import Navigation from "@/components/Navigation";

export default function RemittancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="remittance" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">P2P Remittance</h1>
          <p className="text-xl text-muted-foreground">
            Send APT instantly across the globe using Aptos blockchain
          </p>
        </div>
        <P2PRemittance />
      </div>
    </div>
  );
}
