import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);

    if (error) {
      toast.error(error.message || 'Erreur lors de la connexion');
    } else {
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.fullName
    );

    if (error) {
      if (error.message?.includes('already registered')) {
        toast.error('Cet email est déjà enregistré');
      } else {
        toast.error(error.message || "Erreur lors de l'inscription");
      }
    } else {
      toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setSignupData({ email: '', password: '', fullName: '', confirmPassword: '' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-midnight via-forest to-midnight">
      <Card className="w-full max-w-md tapestry-border litter-frame bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-gold medieval-glow">
            Espace Client
          </CardTitle>
          <CardDescription className="text-ivory/80">
            Accédez à l'espace privé de votre licorne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-gold font-serif">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="bg-input border-gold/30 text-foreground focus:border-gold mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-gold font-serif">
                    Mot de passe
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="bg-input border-gold/30 text-foreground focus:border-gold mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <p className="mt-4 text-center text-sm text-ivory/70">
              L'accès est réservé aux adoptants : vos identifiants vous sont remis par l'éleveuse lors de l'adoption.
            </p>
          </Tabs>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-gold hover:text-gold/80"
            >
              ← Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
