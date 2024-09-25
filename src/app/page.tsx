import { getData } from "@/actions/flatmatesActions";
import Flatmates from "./components/Flatmates";
export default async function Home() {
  const data = await getData();
  console.log(data);
  return <Flatmates flatmates={data} />;
}
