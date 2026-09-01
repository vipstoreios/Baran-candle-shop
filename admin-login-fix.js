(() => {
  const boot = () => {
    const form = document.getElementById('loginForm');
    if (!form || !window.supabase || !window.BARAN_SUPABASE_URL || !window.BARAN_SUPABASE_KEY) return;
    const clean = form.cloneNode(true);
    form.replaceWith(clean);
    const db = window.supabase.createClient(window.BARAN_SUPABASE_URL, window.BARAN_SUPABASE_KEY);
    const auth = document.getElementById('auth');
    const app = document.getElementById('app');
    const msg = document.getElementById('authMsg');
    const button = clean.querySelector('button[type="submit"]');

    const showError = text => {
      msg.textContent = text || 'Login failed.';
      msg.style.display = 'block';
    };

    const enter = async session => {
      if (!session) return showError('Login succeeded, but no session was returned.');
      const { data: profile, error } = await db.from('admin_profiles')
        .select('id,active').eq('id', session.user.id).eq('active', true).maybeSingle();
      if (error) return showError('Login succeeded, but admin access could not be verified. Check admin_profiles RLS.');
      if (!profile) return showError('Email/password are correct, but this account is not an active admin.');
      auth.classList.add('hidden');
      app.classList.remove('hidden');
      const email = document.getElementById('adminEmail');
      if (email) email.textContent = session.user.email || '';
      if (typeof window.baranAdminLoad === 'function') await window.baranAdminLoad();
    };

    clean.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      msg.textContent = 'Signing in…';
      button.disabled = true;
      try {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) {
          console.error(error);
          showError(error.message || 'Invalid login credentials');
          return;
        }
        await enter(data.session);
      } catch (err) {
        console.error(err);
        showError(err.message || 'Unable to sign in.');
      } finally { button.disabled = false; }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
