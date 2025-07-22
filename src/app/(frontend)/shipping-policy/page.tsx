'use client'
import styles from './page.module.scss'

export default function shippingpolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shipping Policy</h1>
        <p className={styles.subtitle}>Vintage Art and Decor</p>
        <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Processing Time</h2>
          <ul className={styles.list}>
            <li>All orders are processed within 2-5 business days after payment confirmation</li>
            <li>Handmade glass artworks require additional handling time for secure packaging</li>
            <li>
              Orders placed on weekends or holidays will be processed on the next business day
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Methods & Timeframes</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Domestic Shipping (India):</h3>
            <ul className={styles.list}>
              <li>Standard Shipping: 5-10 business days</li>
              <li>Express Shipping: 2-4 business days</li>
              <li>Premium Packaging included for all glass items</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>International Shipping:</h3>
            <ul className={styles.list}>
              <li>Standard International: 10-21 business days</li>
              <li>Express International: 5-10 business days</li>
              <li>Customs clearance may add 2-7 additional days</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Costs</h2>
          <ul className={styles.list}>
            <li>Shipping costs are calculated at checkout based on destination and weight</li>
            <li>Free domestic shipping on orders above ₹2,500</li>
            <li>International shipping rates vary by country and are displayed during checkout</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Packaging</h2>
          <ul className={styles.list}>
            <li>All glass artworks are carefully wrapped in bubble wrap and foam padding</li>
            <li>Items are secured in custom-fitted boxes with fragile stickers</li>
            <li>Each package includes handling instructions for the recipient</li>
            <li>Insurance is included on all shipments above ₹1,000</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery</h2>
          <ul className={styles.list}>
            <li>Signature confirmation required for all orders above ₹5,000</li>
            <li>We are not responsible for packages left unattended at the delivery address</li>
            <li>Please inspect your package immediately upon delivery</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Restrictions</h2>
          <ul className={styles.list}>
            <li>We ship worldwide except to countries under international trade restrictions</li>
            <li>Some remote locations may incur additional shipping charges</li>
            <li>Customs duties and taxes are the responsibility of the recipient</li>
          </ul>
        </section>
      </div>

      <div className={styles.footer}>
        <p>Last Updated: January 1, 2025</p>
        <p>For questions about shipping, contact us at shipping@vintageartanddecor.com</p>
      </div>
    </div>
  )
}
