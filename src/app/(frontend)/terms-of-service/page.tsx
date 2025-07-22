import styles from './page.module.scss'

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>Vintage Art and Decor</p>
        <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
          <p className={styles.paragraph}>
            By accessing and using the Vintage Art and Decor website, you accept and agree to be
            bound by these Terms of Service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Registration</h2>
          <ul className={styles.list}>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials
            </li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>One account per person; multiple accounts by the same individual are prohibited</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Information</h2>
          <ul className={styles.list}>
            <li>All handmade glass artworks are unique and may vary slightly from images shown</li>
            <li>
              We strive to display accurate colors and dimensions, but variations may occur due to
              screen settings
            </li>
            <li>Product availability is subject to change without notice</li>
            <li>Custom orders may require additional time and are subject to separate terms</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment Terms</h2>
          <ul className={styles.list}>
            <li>All payments are processed through PhonePe payment gateway</li>
            <li>Prices are listed in Indian Rupees (INR) unless otherwise specified</li>
            <li>International customers may see converted prices in their local currency</li>
            <li>Payment must be received in full before order processing begins</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Conduct</h2>
          <p className={styles.paragraph}>You agree not to:</p>
          <ul className={styles.list}>
            <li>Use the website for any illegal or unauthorized purpose</li>
            <li>Interfere with or disrupt the website's functionality</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Post false, misleading, or defamatory content</li>
            <li>Violate any applicable local, state, or international laws</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property</h2>
          <ul className={styles.list}>
            <li>All content on this website is owned by Vintage Art and Decor</li>
            <li>Product images, descriptions, and artwork designs are protected by copyright</li>
            <li>
              You may not reproduce, distribute, or use our content without written permission
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Privacy and Data Protection</h2>
          <ul className={styles.list}>
            <li>We collect and process personal information as outlined in our Privacy Policy</li>
            <li>Your data is protected using industry-standard security measures</li>
            <li>We do not sell or share personal information with third parties without consent</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <ul className={styles.list}>
            <li>Our liability is limited to the purchase price of the product</li>
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>Claims must be made within 30 days of delivery</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Modifications</h2>
          <ul className={styles.list}>
            <li>We reserve the right to modify these terms at any time</li>
            <li>Changes will be posted on this page with an updated effective date</li>
            <li>Continued use of the website constitutes acceptance of modified terms</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.paragraph}>
            These terms are governed by the laws of India and subject to the jurisdiction of Indian
            courts.
          </p>
        </section>
      </div>

      <div className={styles.footer}>
        <p>Last Updated: January 1, 2025</p>
        <p>For questions about these terms, contact us at legal@vintageartanddecor.com</p>
      </div>
    </div>
  )
}
