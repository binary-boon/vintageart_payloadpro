import styles from './page.module.scss'

export default function refundpolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Refund Policy</h1>
        <p className={styles.subtitle}>Vintage Art and Decor</p>
        <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Return Eligibility</h2>
          <ul className={styles.list}>
            <li>Items must be returned within 14 days of delivery</li>
            <li>Products must be in original condition, unused, and in original packaging</li>
            <li>Custom or personalized items cannot be returned unless defective</li>
            <li>
              Return shipping costs are the responsibility of the customer unless the item is
              defective
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Non-Returnable Items</h2>
          <ul className={styles.list}>
            <li>Custom-made or personalized glass artworks</li>
            <li>Items damaged due to misuse or normal wear</li>
            <li>Products without original packaging or tags</li>
            <li>Items returned after the 14-day window</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Refund Process</h2>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <p>Contact our customer service team to initiate a return</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <p>Receive return authorization and shipping instructions</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <p>Package the item securely and ship using a trackable method</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>4</span>
              <p>
                Refund will be processed within 5-7 business days after we receive the returned item
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Refund Methods</h2>
          <ul className={styles.list}>
            <li>Refunds will be issued to the original payment method (PhonePe)</li>
            <li>Processing time may vary depending on your bank or payment provider</li>
            <li>International customers may incur currency conversion fees</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Damaged or Defective Items</h2>
          <ul className={styles.list}>
            <li>Report damaged or defective items within 48 hours of delivery</li>
            <li>Provide photos of the damage for assessment</li>
            <li>We will provide a prepaid return label for defective items</li>
            <li>Replacement or full refund will be provided at no additional cost</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Exchange Policy</h2>
          <ul className={styles.list}>
            <li>Exchanges are only available for defective or damaged items</li>
            <li>Size or design exchanges are not available for handmade items</li>
            <li>Exchange requests must be made within 7 days of delivery</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Partial Refunds</h2>
          <p className={styles.paragraph}>Partial refunds may be given for:</p>
          <ul className={styles.list}>
            <li>Items with minor defects that don't affect functionality</li>
            <li>Products returned without original packaging</li>
            <li>Items showing signs of use beyond normal inspection</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Processing Time</h2>
          <div className={styles.timelineGrid}>
            <div className={styles.timelineItem}>
              <h4>Return Inspection</h4>
              <p>2-3 business days after receipt</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>Refund Processing</h4>
              <p>5-7 business days</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>Bank Processing</h4>
              <p>3-10 business days (varies by institution)</p>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>Last Updated: January 1, 2025</p>
        <p>For refund inquiries, contact us at refunds@vintageartanddecor.com</p>
      </div>
    </div>
  )
}
