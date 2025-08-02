import { useState } from 'react';
import {
  Container, TextField, Typography, Box,
  FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress, ThemeProvider,
  createTheme, CssBaseline, Paper
} from '@mui/material';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1117',
      paper: '#1c1f26',
    },
    primary: {
      main: '#4dabf7',
    },
    secondary: {
      main: '#f48fb1',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#aaaaaa',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

function App() {
  const [email, setEmail] = useState('');
  const [tone, setTone] = useState('');
  const [comment, setCommemnt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/email/generate",
        {
          emailContent: email,
          tone,
          comments: comment
        }
      );
      setReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            ✉️ AI Email Assistant
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="filled"
              label="Original Email Content"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl fullWidth variant="filled">
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              variant="filled"
              label="Comments (optional)"
              value={comment}
              onChange={(e) => setCommemnt(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={!email || loading}
              sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "🚀 Generate Reply"}
            </Button>

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            {reply && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  🧠 Generated Reply:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="filled"
                  value={reply}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  variant="outlined"
                  sx={{ mt: 2, textTransform: 'none' }}
                  onClick={() => navigator.clipboard.writeText(reply)}
                >
                  📋 Copy to Clipboard
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
