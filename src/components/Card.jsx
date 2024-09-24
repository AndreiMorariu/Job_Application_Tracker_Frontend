import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Card2({ title, value = 0 }) {
  const isPercentage =
    title === "Response Rate" ||
    title === "Success Rate" ||
    title === "Rejection Rate";

  return (
    <Card
      sx={{
        height: "12rem",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Box>
          <Typography
            variant="h4"
            component="div"
            fontWeight="700"
            marginTop="3rem"
          >
            {isPercentage ? `${value}%` : value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Card2;
