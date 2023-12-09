// api/checkAvailability.ts
import { NextApiHandler } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const formatDateTimeForPostgres = (dateTime: Date) => {
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T00:00:00`;
    return formattedDateTime;
  };

const checkAvailability = async (duration: number, startTime: Date, data: any[] | null) => {
  const datesToUpdate = [];

  for (let i = 0; i < duration; i++) {
    const time = new Date(startTime);
    time.setDate(time.getDate() + i + 1);

    const formattedTime = formatDateTimeForPostgres(time);

    console.log(formattedTime)

    const availabilityRecord = data?.find((record) => record.tanggal_ketersediaan === formattedTime);

    if (availabilityRecord) {
      if (availabilityRecord.kapasitas === 0) {
        return { error: 'Kapasitas penuh' };
      }
    }

    datesToUpdate.push(formattedTime);
  }

  return { success: true, datesToUpdate };
};

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient({ req, res })

  const user = await supabase.auth.getSession();

  if (user.data.session === null){
    return res.json({ message: 'unauthorized' })
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { duration, startTime } = req.body;

    const { data, error } = await supabase.from('ketersediaan').select('*');

    const availabilityCheckResult = await checkAvailability(duration, startTime, data);

    if (availabilityCheckResult.error) {
      return res.status(400).json({ error: availabilityCheckResult.error });
    }

    // Your code for updating the database with availabilityCheckResult.datesToUpdate

    return res.status(200).json({ success: true, datesToUpdate: availabilityCheckResult.datesToUpdate });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
