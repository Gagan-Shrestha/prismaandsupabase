/** @format */
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SuccessNotification from "./SuccessNotification";
import FailedNotification from "./FailedNotification";

// Define an interface for the component props
interface SubscribeToPushProps {}

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export function SubscribeToPush({}: SubscribeToPushProps) {
  const { data: session, status } = useSession();
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const [isEnable, setIsEnable] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [successNotifi, setSuccessNotify] = useState(false);
  const [failNotify, setFailNotify] = useState(false);
  const [message, setMessage] = useState("");

  const suscribePush = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // The user has accepted; you can now send them push notifications!
        } else if (permission === "denied") {
          console.log("Notification permission denied.");
          // The user has denied; you cannot send them push notifications.
        }
      });
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          // Check if the service worker is already active

          if (registration.active) {
            console.log("Reached gere");
            subscribeToPushNotifications(registration);
          } else {
            // Listen for the service worker to become active
            registration.addEventListener("statechange", (e) => {
              const reg = e.target as ServiceWorkerRegistration;
              if (reg.active) {
                subscribeToPushNotifications(registration);
              }
            });
          }
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  };
  const subscribeToPushNotifications = (
    registration: ServiceWorkerRegistration
  ) => {
    console.log("Reached gere", registration);
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey || ""),
      })
      .then((subscription) => {
        fetch("/api/notification/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription: subscription }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              //console.log("Subscribed to push notifications:", subscription);
              localStorage.setItem(
                "subscription",
                JSON.stringify(subscription)
              );
              console.log("Suscribed");
              setMessage("Suscribed to notification");
              setSuccessNotify(true);
            } else if (data.error) {
              setMessage("Error subscribing to notifications" + data.error);
              setFailNotify(true);
            }
          })
          .catch((error) => {
            console.error("Error subscribing to notifications:", error);
            setMessage("Error subscribing to notifications");
            setFailNotify(true);
          });
        // Send the subscription to your server
      })
      .catch((error) => {
        console.error("Error subscribing to notifications:", error);
        // setMessage("Error subscribing to notifications");
        // setFailNotify(true);
      });
  };
  useEffect(() => {
    if (vapidPublicKey && status === "authenticated") {
      let value = localStorage.getItem("subscription");
      console.log("first", value, vapidPublicKey);
      if (!value) {
        suscribePush();
      }
    }
  }, [vapidPublicKey, status]); // Dependency array to re-run the effect if the vapidPublicKey changes

  return (
    <>
      {isEnable && (
        <div className="fixed inset-x-0  bottom-20 p-4 bg-white shadow-lg flex justify-between items-center space-x-4 z-50">
          <div className=" float-right">
            <button
              onClick={() => setIsEnable(true)}
              className=" font-bold py-2 px-4 rounded"
            >
              <FaTimes />
            </button>
          </div>
          <span className="flex-1 text-sm text-gray-600">
            Do you want to get notifications?
          </span>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => suscribePush()}
          >
            Subscribe to Push Notifications
          </button>

          {successNotifi && <SuccessNotification message={message} />}
          {failNotify && <FailedNotification message={message} />}
        </div>
      )}
    </>
  );
}
