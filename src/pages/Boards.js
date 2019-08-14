import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Boards = () => {
  const [boards, setBoards] = useState(null);

  // useEffect(() => {
  //   const fetchBoards = async () => {
  //     try {
  //       const res = axios.get('');
  //       console.log(res);
  //       return res;
  //     } catch(err) {
  //       console.error(err);
  //       return err;
  //     }
  //   }

  //   fetchBoards();
  // }, []);
  return(
    <div>
      <h1>Boards:</h1>

    </div>
  )
}

export default CreateBoard;