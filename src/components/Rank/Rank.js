import React, { useState, useEffect }from 'react';

const Rank = ({ name, entries }) => {
const [ emoji, setEmoji ] = useState('')

useEffect(()=> {
  fetch(`https://bk3a3pr8r1.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
  .then(res => res.json())
  .then((res)=> {
    console.log(res)
    setEmoji(res.input)
  })
},[entries])

  return (
    <div>
      <div className='white f3'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='white f1'>
        {entries}
      </div>
      <div className='white f1'>
        {`Rank Badge is : ${emoji}`}
      </div>
    </div>
  );
}

export default Rank;