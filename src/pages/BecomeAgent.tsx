
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { UserPlus, CheckCircle, DollarSign, Users, TrendingUp } from 'lucide-react';

const BecomeAgent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    country: '',
    experience: '',
    motivation: '',
    referralCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to Baserow or another service
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Application submitted successfully! We will review your application and get back to you within 24-48 hours.');
      
      // Reset form
      setFormData({
        fullName: user?.username || '',
        email: user?.email || '',
        phone: '',
        country: '',
        experience: '',
        motivation: '',
        referralCode: ''
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Become Our Agent</h2>
        <p className="text-muted-foreground">
          Join our partner network and earn commissions by referring new clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <CardTitle>High Commissions</CardTitle>
            <CardDescription>Earn up to 30% commission on all referrals</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-blue-500 mb-2" />
            <CardTitle>Dedicated Support</CardTitle>
            <CardDescription>Get personal support from our agent success team</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-purple-500 mb-2" />
            <CardTitle>Growing Market</CardTitle>
            <CardDescription>Tap into the rapidly expanding crypto market</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Agent Application Form
            </CardTitle>
            <CardDescription>
              Fill out the form below to apply for our agent program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Trading/Finance Experience</Label>
                <Select onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to become an agent?</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                  placeholder="Tell us about your motivation and goals..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  value={formData.referralCode}
                  onChange={(e) => handleInputChange('referralCode', e.target.value)}
                  placeholder="Enter referral code if you have one"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Benefits</CardTitle>
            <CardDescription>What you get as our partner agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Competitive Commissions</h4>
                <p className="text-sm text-muted-foreground">Earn 15-30% commission on all successful referrals</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Marketing Materials</h4>
                <p className="text-sm text-muted-foreground">Access to professional marketing assets and tools</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Real-time Tracking</h4>
                <p className="text-sm text-muted-foreground">Monitor your referrals and earnings in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Weekly Payouts</h4>
                <p className="text-sm text-muted-foreground">Get paid weekly via your preferred method</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Training & Support</h4>
                <p className="text-sm text-muted-foreground">Comprehensive training and ongoing support</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Performance Bonuses</h4>
                <p className="text-sm text-muted-foreground">Additional bonuses for top-performing agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BecomeAgent;
