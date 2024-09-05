import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import calculateReturns from "../functions/calculateReturns";

interface Row {
  date: string;
  amount: string;
}

const SPYCalculator: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([{ date: "", amount: "" }]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleAddRow = () => {
    setRows([...rows, { date: "", amount: "" }]);
  };

  const handleDeleteRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows.length ? newRows : [{ date: "", amount: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Row,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    for (const row of rows) {
      if ((row.date && !row.amount) || (!row.date && row.amount)) {
        setError("Please fill out both date and amount for each row.");
        return;
      }
    }

    // Filter out empty rows
    const filledRows = rows.filter((row) => row.date && row.amount);

    try {
      const totalValue = await calculateReturns(filledRows);
      setResult(totalValue.toFixed(2));
    } catch (error) {
      setError("Failed to calculate. Please try again.");
    }
  };

  return (
    <Paper style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <Typography variant="h4" gutterBottom>
        SPY Investment Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Purchased</TableCell>
                <TableCell>Amount (USD)</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleInputChange(index, "date", e.target.value)
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      placeholder="Enter amount"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteRow(index)}
                      disabled={rows.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          onClick={handleAddRow}
          style={{ marginTop: "10px", marginRight: "10px" }}
        >
          Add Row
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "10px" }}
        >
          Calculate
        </Button>
      </form>
      {error && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {error}
        </Alert>
      )}
      {result && !error && (
        <Alert severity="success" style={{ marginTop: "20px" }} icon={false}>
          Your portfolio would be worth ${result} at market-level performance.
        </Alert>
      )}
    </Paper>
  );
};

export default SPYCalculator;
