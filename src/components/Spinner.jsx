import { MoonLoader } from "react-spinners";

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "1rem",
      }}
    >
      <MoonLoader size={30} />
    </div>
  );
}

export default Spinner;
