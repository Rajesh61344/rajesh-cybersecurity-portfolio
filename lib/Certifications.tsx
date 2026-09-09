"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Award,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  Fingerprint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  getCertifications,
  CERTIFICATIONS_STORAGE_KEY,
  type CertificationItem,
} from "@/lib/certificationsStorage";

export default function Certifications() {
  const [
    certifications,
    setCertifications,
  ] = useState<CertificationItem[]>([]);

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    setCertifications(
      getCertifications()
    );
  }, []);

  /*
   * Same tab updates
   */
  useEffect(() => {
    const handleUpdate = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<
          CertificationItem[]
        >;

      if (
        Array.isArray(
          customEvent.detail
        )
      ) {
        setCertifications(
          customEvent.detail
        );
      } else {
        setCertifications(
          getCertifications()
        );
      }
    };

    window.addEventListener(
      "certifications-updated",
      handleUpdate
    );

    /*
     * Other tabs
     */
    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key !==
        CERTIFICATIONS_STORAGE_KEY
      ) {
        return;
      }

      setCertifications(
        getCertifications()
      );
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "certifications-updated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /*
   * Intersection animation
   */
  useEffect(() => {
    const section =
      document.getElementById(
        "certifications"
      );

    if (!section) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        },
        {
          threshold: 0.12,
        }
      );

    observer.observe(section);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <section
      id="certifications"
      className="
        relative
        overflow-hidden
        border-y
        border-white/[0.04]
        bg-[#010405]
        py-28
      "
    >
      {/* Background */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div className="cert-grid absolute inset-0" />

        <div
          className="
            absolute
            left-[5%]
            top-[15%]
            h-80
            w-80
            rounded-full
            bg-cyan-400/[0.025]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[5%]
            h-80
            w-80
            rounded-full
            bg-blue-500/[0.025]
            blur-[130px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
        "
      >
        {/* Header */}

        <div
          className={`
            mb-14
            transition-all
            duration-1000
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }
          `}
        >
          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-400/15
              bg-cyan-400/[0.035]
              px-4
              py-2
            "
          >
            <Award
              size={12}
              className="text-cyan-300"
            />

            <span
              className="
                font-mono
                text-[8px]
                font-bold
                tracking-[0.2em]
                text-cyan-300
              "
            >
              CERTIFICATIONS // VERIFIED
            </span>

            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-emerald-400
              "
            />
          </div>

          <h2
            className="
              text-3xl
              font-black
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            Professional{" "}
            <span className="text-cyan-300">
              Certifications
            </span>
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-white/50
            "
          >
            Verified certifications and technical
            credentials supporting my cybersecurity
            career.
          </p>
        </div>

        {/* Certification Grid */}

        {certifications.length > 0 ? (
          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {certifications.map(
              (cert, index) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  index={index}
                  visible={visible}
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              rounded-3xl
              border
              border-white/[0.07]
              bg-white/[0.018]
              p-12
              text-center
            "
          >
            <Award
              size={30}
              className="
                mx-auto
                text-cyan-300/40
              "
            />

            <p
              className="
                mt-4
                font-mono
                text-xs
                tracking-[0.12em]
                text-white/30
              "
            >
              NO CERTIFICATIONS AVAILABLE
            </p>
          </div>
        )}

        {/* Live status */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-white/[0.06]
            bg-white/[0.018]
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <Fingerprint
              size={15}
              className="text-cyan-300"
            />

            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.14em]
                text-white/30
              "
            >
              CREDENTIAL DATABASE
            </span>
          </div>

          <span
            className="
              font-mono
              text-[7px]
              font-bold
              text-emerald-400
            "
          >
            {certifications.length} VERIFIED
          </span>
        </div>
      </div>

      <style jsx>{`
        .cert-grid {
          background-image:
            linear-gradient(
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            );

          background-size: 52px 52px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 82%
          );
        }
      `}</style>
    </section>
  );
}

/* ======================================================
   CARD
====================================================== */

function CertificationCard({
  certification,
  index,
  visible,
}: {
  certification: CertificationItem;
  index: number;
  visible: boolean;
}) {
  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.07]
        bg-white/[0.018]
        p-6
        backdrop-blur-xl
        transition-all
        duration-700
        hover:-translate-y-2
        hover:border-cyan-400/25
        hover:shadow-[0_25px_70px_rgba(34,211,238,0.07)]
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }
      `}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-cyan-400/[0.025]
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-cyan-400/[0.07]
        "
      />

      {/* Icon */}

      <div
        className="
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-cyan-400/15
          bg-cyan-400/[0.04]
          text-cyan-300
          transition-transform
          duration-500
          group-hover:scale-110
        "
      >
        <ShieldCheck size={25} />

        <span
          className="
            absolute
            -right-1
            -top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            border
            border-[#010405]
            bg-emerald-400
            text-[#010405]
          "
        >
          <BadgeCheck size={11} />
        </span>
      </div>

      {/* Content */}

      <div className="relative mt-6">
        <p
          className="
            font-mono
            text-[7px]
            font-bold
            tracking-[0.16em]
            text-cyan-300/70
          "
        >
          VERIFIED CERTIFICATION
        </p>

        <h3
          className="
            mt-2
            text-lg
            font-black
            text-white
            transition-colors
            group-hover:text-cyan-200
          "
        >
          {certification.title}
        </h3>

        <p
          className="
            mt-2
            text-xs
            font-medium
            text-white/45
          "
        >
          {certification.issuer}
        </p>

        {certification.description && (
          <p
            className="
              mt-4
              text-[10px]
              leading-5
              text-white/35
            "
          >
            {certification.description}
          </p>
        )}
      </div>

      {/* Meta */}

      <div
        className="
          relative
          mt-6
          flex
          flex-wrap
          gap-2
        "
      >
        <span
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3
            py-2
            font-mono
            text-[6px]
            text-white/35
          "
        >
          <CalendarDays
            size={10}
            className="text-cyan-300/60"
          />

          {certification.date}
        </span>

        {certification.credential && (
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-emerald-400/10
              bg-emerald-400/[0.025]
              px-3
              py-2
              font-mono
              text-[6px]
              text-emerald-400/70
            "
          >
            <BadgeCheck size={10} />

            {certification.credential}
          </span>
        )}
      </div>

      {/* Footer */}

      <div
        className="
          relative
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-white/[0.06]
          pt-5
        "
      >
        <div className="flex items-center gap-2">
          <Sparkles
            size={11}
            className="text-cyan-300/50"
          />

          <span
            className="
              font-mono
              text-[6px]
              tracking-[0.12em]
              text-white/25
            "
          >
            CREDENTIAL VERIFIED
          </span>
        </div>

        <ExternalLink
          size={11}
          className="
            text-white/20
            transition-colors
            group-hover:text-cyan-300
          "
        />
      </div>

      {/* Bottom line */}

      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-px
          w-0
          -translate-x-1/2
          bg-cyan-300
          shadow-[0_0_12px_rgba(34,211,238,0.8)]
          transition-all
          duration-500
          group-hover:w-2/3
        "
      />
    </article>
  );
}