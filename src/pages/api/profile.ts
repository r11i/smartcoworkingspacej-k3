import { NextApiHandler } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const handler: NextApiHandler = async (req, res) => {
  const  { user_email } = req.query

  const supabase = createPagesServerClient({ req, res })

  const user = await supabase.auth.getSession();

  if (user.data.session === null){
    return res.json({ message: 'unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log(user_email)
    const { data, error } = await supabase.from('member')
      .select('*')
      .eq('email', user_email);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler
