import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-card/50 border-b border-primary/20">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-text text-center">
              About INF!NITE C107HING
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
              Redefining modern streetwear with purpose-driven designs
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
              Our <span className="text-primary glow-text">Mission</span>
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Infinite Clothing was born from a simple belief: fashion should be more than just fabric. It should be a statement of who you are, what you believe in, and where you're going. We create streetwear that inspires confidence, creativity, and individuality.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Every piece in our collection is designed with purpose. We blend bold, futuristic aesthetics with uncompromising comfort, ensuring that you not only look good but feel amazing. Our designs push boundaries while staying true to the core values of authenticity and self-expression.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that what you wear should move you—literally and figuratively. Whether you're conquering the streets, the studio, or the world, INF!NITE C107HING is here to support your journey with style that's as limitless as your potential.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card/50">
          <div className="container">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Our <span className="text-primary glow-text">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center glow-box">
                  <span className="text-3xl font-bold text-primary">01</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Confidence</h3>
                <p className="text-muted-foreground">
                  We design pieces that empower you to stand tall and own your space with unwavering self-assurance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center glow-box">
                  <span className="text-3xl font-bold text-primary">02</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Creativity</h3>
                <p className="text-muted-foreground">
                  Our collections celebrate bold expression and innovative design that breaks the mold of conventional fashion.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center glow-box">
                  <span className="text-3xl font-bold text-primary">03</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Individuality</h3>
                <p className="text-muted-foreground">
                  Every piece is crafted to help you express your unique identity and personal style without compromise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tagline */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-4xl md:text-6xl font-bold glow-text mb-4">
              Wear What Moves You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the movement. Express yourself. Be infinite.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

