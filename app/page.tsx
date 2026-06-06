import { mockProperties } from "@/data/properties";
import { HomeScreen } from "@/components/ui/HomeScreen";

export default function Home() {
  return <HomeScreen initialProperties={mockProperties} />;
}
