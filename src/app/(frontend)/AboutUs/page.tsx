'use client'

import React, { Fragment } from 'react'

import { Button } from '../../../components/Button'
import { HR } from '../../../components/HR'

import classes from './page.module.scss'

export default function AboutUs() {
  return (
    <Fragment>
      <div className={classes.aboutUsContainer}>
        {/* Hero Section */}
        <section className={classes.heroSection}>
          <div className={classes.heroContent}>
            <div className={classes.heroText}>
              <h1 className={classes.mainTitle}>Vintage Art and Decor</h1>
              <p className={classes.heroSubtitle}>
                Preserving the timeless beauty of Rajasthani craftsmanship for over 50 years
              </p>
              <div className={classes.heroStats}>
                <div className={classes.stat}>
                  <span className={classes.statNumber}>50+</span>
                  <span className={classes.statLabel}>Years of Excellence</span>
                </div>
                <div className={classes.stat}>
                  <span className={classes.statNumber}>1000+</span>
                  <span className={classes.statLabel}>Artworks Created</span>
                </div>
                <div className={classes.stat}>
                  <span className={classes.statNumber}>100%</span>
                  <span className={classes.statLabel}>Handcrafted</span>
                </div>
              </div>
            </div>
            <div className={classes.heroImage}>
              <div className={classes.imageWrapper}>
                <img src="/media/peacock-1.jpg" alt="Vintage Art and Decor" />
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* Our Story Section */}
        <section className={classes.storySection}>
          <div className={classes.sectionContainer}>
            <div className={classes.storyContent}>
              <div className={classes.storyText}>
                <h2>Our Legacy</h2>
                <p className={classes.storyDescription}>
                  Founded in the early 1970s, Vintage Art and Decor began as a small family workshop
                  in the heart of Rajasthan. What started as a passion for preserving traditional
                  Thikri mirror work has blossomed into a renowned establishment that has been
                  creating exquisite handmade artworks for over five decades.
                </p>
                <p className={classes.storyDescription}>
                  Our journey is rooted in the rich cultural heritage of Rajasthan, where the
                  ancient technique of Thikri work - the intricate art of embedding small mirrors
                  into fabric and wood - has been passed down through generations. We have dedicated
                  ourselves to not just preserving this traditional craft, but elevating it to
                  contemporary artistic excellence.
                </p>
              </div>
              <div className={classes.storyTimeline}>
                <div className={classes.timelineItem}>
                  <div className={classes.timelineYear}>1970s</div>
                  <div className={classes.timelineContent}>
                    <h4>The Beginning</h4>
                    <p>
                      Founded as a small family workshop specializing in traditional Thikri work
                    </p>
                  </div>
                </div>
                <div className={classes.timelineItem}>
                  <div className={classes.timelineYear}>1980s</div>
                  <div className={classes.timelineContent}>
                    <h4>Expansion</h4>
                    <p>Grew our artisan network and began creating larger decorative pieces</p>
                  </div>
                </div>
                <div className={classes.timelineItem}>
                  <div className={classes.timelineYear}>2000s</div>
                  <div className={classes.timelineContent}>
                    <h4>Recognition</h4>
                    <p>Gained national recognition for preserving traditional Rajasthani crafts</p>
                  </div>
                </div>
                <div className={classes.timelineItem}>
                  <div className={classes.timelineYear}>Today</div>
                  <div className={classes.timelineContent}>
                    <h4>Legacy Continues</h4>
                    <p>Leading provider of authentic handmade Thikri artwork worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* Thikri Craft Section */}
        <section className={classes.craftSection}>
          <div className={classes.sectionContainer}>
            <h2 className={classes.sectionTitle}>The Art of Thikri</h2>
            <div className={classes.craftContent}>
              <div className={classes.craftDescription}>
                <h3>Traditional Rajasthani Mirror Work</h3>
                <p>
                  Thikri work is an ancient decorative technique that originated in the royal courts
                  of Rajasthan. This intricate craft involves the careful placement of small mirrors
                  (called &apos; Aabhla in local dialect) onto fabric, wood, or other surfaces using
                  traditional stitching techniques and adhesive methods passed down through
                  generations.
                </p>
                <div className={classes.craftFeatures}>
                  <div className={classes.feature}>
                    <h4>Handcrafted Excellence</h4>
                    <p>
                      Every piece is meticulously created by skilled artisans using traditional
                      tools and techniques
                    </p>
                  </div>
                  <div className={classes.feature}>
                    <h4>Premium Materials</h4>
                    <p>
                      We use only the finest mirrors, fabrics, and wood sourced from trusted
                      suppliers
                    </p>
                  </div>
                  <div className={classes.feature}>
                    <h4>Cultural Authenticity</h4>
                    <p>
                      Our designs stay true to traditional Rajasthani patterns while embracing
                      modern aesthetics
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.craftProcess}>
                <h3>Our Process</h3>
                <div className={classes.processSteps}>
                  <div className={classes.step}>
                    <div className={classes.stepNumber}>01</div>
                    <div className={classes.stepContent}>
                      <h4>Design Creation</h4>
                      <p>
                        Traditional patterns are carefully planned and sketched by master artisans
                      </p>
                    </div>
                  </div>
                  <div className={classes.step}>
                    <div className={classes.stepNumber}>02</div>
                    <div className={classes.stepContent}>
                      <h4>Material Preparation</h4>
                      <p>
                        Mirrors are cut to precise sizes and fabrics are prepared with traditional
                        dyes
                      </p>
                    </div>
                  </div>
                  <div className={classes.step}>
                    <div className={classes.stepNumber}>03</div>
                    <div className={classes.stepContent}>
                      <h4>Handcrafting</h4>
                      <p>
                        Skilled artisans carefully embed each mirror using time-honored techniques
                      </p>
                    </div>
                  </div>
                  <div className={classes.step}>
                    <div className={classes.stepNumber}>04</div>
                    <div className={classes.stepContent}>
                      <h4>Quality Assurance</h4>
                      <p>
                        Every piece undergoes rigorous quality checks before reaching our customers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* Values Section */}
        <section className={classes.valuesSection}>
          <div className={classes.sectionContainer}>
            <h2 className={classes.sectionTitle}>Our Values</h2>
            <div className={classes.valuesGrid}>
              <div className={classes.valueCard}>
                <div className={classes.valueIcon}>🎨</div>
                <h3>Authenticity</h3>
                <p>
                  We preserve traditional crafting methods while creating pieces that resonate with
                  contemporary tastes
                </p>
              </div>
              <div className={classes.valueCard}>
                <div className={classes.valueIcon}>👥</div>
                <h3>Artisan Support</h3>
                <p>
                  We work directly with local artisans, ensuring fair wages and preserving
                  traditional skills
                </p>
              </div>
              <div className={classes.valueCard}>
                <div className={classes.valueIcon}>⭐</div>
                <h3>Quality Excellence</h3>
                <p>
                  Every piece meets our exacting standards for craftsmanship, durability, and beauty
                </p>
              </div>
              <div className={classes.valueCard}>
                <div className={classes.valueIcon}>🌱</div>
                <h3>Sustainability</h3>
                <p>
                  We use eco-friendly materials and support sustainable practices in our craft
                  community
                </p>
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* Team Section */}
        <section className={classes.teamSection}>
          <div className={classes.sectionContainer}>
            <h2 className={classes.sectionTitle}>Master Artisans</h2>
            <p className={classes.teamDescription}>
              Our success is built on the shoulders of incredibly talented artisans who have
              dedicated their lives to perfecting the art of Thikri work. Many of our master
              craftsmen represent the third and fourth generations of their families to work with
              traditional mirror art.
            </p>
            <div className={classes.teamGrid}>
              <div className={classes.teamMember}>
                <div className={classes.memberImage}>
                  <div className={classes.placeholderAvatar}>Master Artisan</div>
                </div>
                <div className={classes.memberInfo}>
                  <h4>Ramesh Kumar</h4>
                  <p className={classes.memberRole}>Lead Master Craftsman</p>
                  <p className={classes.memberExperience}>35+ years experience</p>
                </div>
              </div>
              <div className={classes.teamMember}>
                <div className={classes.memberImage}>
                  <div className={classes.placeholderAvatar}>Design Expert</div>
                </div>
                <div className={classes.memberInfo}>
                  <h4>Priya Sharma</h4>
                  <p className={classes.memberRole}>Design Director</p>
                  <p className={classes.memberExperience}>25+ years experience</p>
                </div>
              </div>
              <div className={classes.teamMember}>
                <div className={classes.memberImage}>
                  <div className={classes.placeholderAvatar}>Quality Expert</div>
                </div>
                <div className={classes.memberInfo}>
                  <h4>Vijay Singh</h4>
                  <p className={classes.memberRole}>Quality Assurance Head</p>
                  <p className={classes.memberExperience}>30+ years experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* Call to Action Section */}
        <section className={classes.ctaSection}>
          <div className={classes.sectionContainer}>
            <div className={classes.ctaContent}>
              <h2>Experience Timeless Beauty</h2>
              <p>
                Discover our collection of handcrafted Thikri artworks and bring the rich heritage
                of Rajasthani craftsmanship to your home.
              </p>
              <div className={classes.ctaButtons}>
                <Button
                  href="/products"
                  label="View Our Collection"
                  appearance="primary"
                  className={classes.ctaButton}
                />
                <Button
                  href="/contact"
                  label="Custom Orders"
                  appearance="secondary"
                  className={classes.ctaButton}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  )
}
