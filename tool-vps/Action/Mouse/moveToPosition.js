async function moveToPosition(cursor, position) {
    try {
      await cursor.moveTo(position);
      return true;
    } catch (error) {
      console.error(`Error moving to position: ${error}`);
      return false;
    }
  }
  
module.exports = moveToPosition;