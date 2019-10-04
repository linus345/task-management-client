import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import {
  Button,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { UserContext } from '../context/UserContext';
import Loading from '../components/Loading';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
    marginTop: '4px',
    marginRight: theme.spacing(1),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gridGap: theme.spacing(1),
  },
  card: {
    minWidth: '200px',
    width: '100%',
  },
  title: {
    fontSize: '1rem',
  },
}));

let isMounted = false;

const Boards = ({ history }) => {
  const classes = useStyles();
  const { setUser } = useContext(UserContext);
  const [boards, setBoards] = useState([]);
  const [boardLabel, setBoardLabel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  isMounted = true;

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const url = process.env.REACT_APP_API_URL + '/boards'
        const res = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(res);
        if(isMounted) {
          setBoards(res.data.boards);
          setIsLoading(false);
        }
      } catch(error) {
        console.log('error: ', error.response);
        if(isMounted) {
          setIsLoading(false);
          if (error.response && error.response.status === 401) {
            setUser(null);
            history.push('/login');
          }
        }
      }
    }
    const token = localStorage.getItem('auth_token');
    if(token) {
      fetchBoards();
    } else {
      if(isMounted) {
        setIsLoading(false);
        setUser(null);
        history.push('/login');
      }
    }

    // cleanup
    return () => { isMounted = false };
    // to get rid of linter warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!boardLabel) return;
    try {
      const url = process.env.REACT_APP_API_URL + '/boards';
      const token = localStorage.getItem('auth_token');
      if(!token) return;
      const res = await axios.post(url, {
        label: boardLabel,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if(isMounted) {
        setBoards([...boards, res.data.board]);
      }
    } catch(error) {
      console.log(error.response);
      if (isMounted) {
        if (error.response && error.response.status === 401) {
          setUser(null);
          history.push('/login');
        }
      }
    }
    
    if(isMounted) {
      setBoardLabel('');
    }
  }

  return(
    <div>
      {isLoading ? <Loading /> : (
        <React.Fragment>
          <Paper className={classes.paper}>
            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                id="outlined-dense"
                placeholder="Add board"
                className={classes.input}
                margin="dense"
                variant="outlined"
                value={boardLabel}
                onChange={e => setBoardLabel(e.target.value)}
                onBlur={e => setBoardLabel(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >Add</Button>
            </form>
          </Paper>
          <Grid container className={classes.grid}>
            {boards.map(board => {
              const date = new Date(board.createdAt);
              // format date
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const createdAt = `${year}-${month < 9 ? '0' + month : month}-${day < 9 ? '0' + day : day}`;
              return(
                <Grid 
                  item
                  key={board._id}
                >
                  <Link 
                    component={RouterLink}
                    to={`/boards/${board._id}`}
                    underline="none"
                  >
                    <Card className={classes.card}>
                      <CardActionArea>
                        <CardContent>
                          <Typography variant="subtitle2" className={classes.title}>
                            {board.label}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {createdAt}
                          </Typography>
                          <Typography variant="subtitle2">
                            &#45;&#45;&#45;
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Members: {board.members.length}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            Tasks: {board.columns.reduce((acc, column) => {
                              return acc + column.tasks.length;
                            }, 0)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </Grid>
              )
            })}
          </Grid>
        </React.Fragment>
      )}
    </div>
  )
}

export default withRouter(Boards);