import styles from './page.module.scss'

export default function CookiePolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cookie Policy</h1>
        <p className={styles.subtitle}>Vintage Art and Decor</p>
        <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Are Cookies</h2>
          <p className={styles.paragraph}>
            Cookies are small text files stored on your device when you visit our website. They help
            us provide you with a better browsing experience and improve our services.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Types of Cookies We Use</h2>

          <div className={styles.cookieType}>
            <h3 className={styles.cookieTypeTitle}>Essential Cookies</h3>
            <ul className={styles.list}>
              <li>Session management and security</li>
              <li>Shopping cart functionality</li>
              <li>User authentication and login status</li>
              <li>Payment processing through PhonePe</li>
            </ul>
          </div>

          <div className={styles.cookieType}>
            <h3 className={styles.cookieTypeTitle}>Performance Cookies</h3>
            <ul className={styles.list}>
              <li>Website analytics and performance monitoring</li>
              <li>Error tracking and debugging</li>
              <li>Load time optimization</li>
              <li>User behavior analysis for site improvement</li>
            </ul>
          </div>

          <div className={styles.cookieType}>
            <h3 className={styles.cookieTypeTitle}>Functional Cookies</h3>
            <ul className={styles.list}>
              <li>Language and currency preferences</li>
              <li>User account settings and preferences</li>
              <li>Wishlist and recently viewed items</li>
              <li>Personalized content recommendations</li>
            </ul>
          </div>

          <div className={styles.cookieType}>
            <h3 className={styles.cookieTypeTitle}>Marketing Cookies</h3>
            <ul className={styles.list}>
              <li>Advertising effectiveness measurement</li>
              <li>Social media integration</li>
              <li>Remarketing and targeted advertising</li>
              <li>Email marketing campaign tracking</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Cookies</h2>
          <p className={styles.paragraph}>We may use cookies from trusted third-party services:</p>
          <ul className={styles.list}>
            <li>Google Analytics for website performance analysis</li>
            <li>PhonePe payment gateway for transaction processing</li>
            <li>Social media platforms for sharing functionality</li>
            <li>Advertising networks for relevant ad display</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Managing Your Cookie Preferences</h2>
          <p className={styles.paragraph}>You can control cookies through:</p>
          <ul className={styles.list}>
            <li>Browser settings to block or delete cookies</li>
            <li>Opt-out links provided by third-party services</li>
            <li>Our cookie preference center (when available)</li>
            <li>Disabling specific types of cookies</li>
          </ul>
          <div className={styles.warning}>
            <p>
              <strong>Note:</strong> Disabling essential cookies may affect website functionality
              and your ability to make purchases.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookie Retention</h2>
          <ul className={styles.list}>
            <li>Session cookies are deleted when you close your browser</li>
            <li>Persistent cookies remain for specified periods (typically 30 days to 2 years)</li>
            <li>You can delete cookies manually through your browser settings</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Protection</h2>
          <ul className={styles.list}>
            <li>
              Cookies do not contain personally identifiable information unless you're logged in
            </li>
            <li>We use cookies in compliance with applicable data protection laws</li>
            <li>Cookie data is secured using industry-standard encryption</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Updates to This Policy</h2>
          <p className={styles.paragraph}>
            We may update this Cookie Policy to reflect changes in our practices or legal
            requirements. Please review this page periodically for updates.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.paragraph}>For questions about our cookie usage, contact us at:</p>
          <ul className={styles.contactList}>
            <li>Email: privacy@vintageartanddecor.com</li>
            <li>Phone: +91-XXXX-XXXXXX</li>
            <li>Address: Your Business Address</li>
          </ul>
        </section>
      </div>

      <div className={styles.footer}>
        <p>Last Updated: January 1, 2025</p>
        <p>This policy is subject to change. Please review it periodically for updates.</p>
      </div>
    </div>
  )
}
