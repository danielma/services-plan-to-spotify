(ns services-plan-to-spotify
  "it builds spotify playlists from pco plans"
  (:require request
            [colors.safe :as colors]
            [wisp.runtime :refer [isEqual]]
            [wisp.sequence
             :refer [list last symbol]]))

(def plan-id (get process.argv 2))
(def application-id (.-env.APPLICATION_ID process))
(def application-secret (.-env.APPLICATION_SECRET process))

(defn identity [x] x)

(defmacro > [& forms]
  `(fn [it] ~@forms))

(defn p
  ([] nil)
  ([item] (do (console.log item) item))
  ([& items] (do (console.log.apply console items) items)))

(defn --parse-route [href-or-route]
  (if (identical? (.substring href-or-route 0 5) "https")
    href-or-route
    (+ "https://api.planningcenteronline.com/services/v2/" href-or-route)))

(defn --api-request [options]
  (let [url (--parse-route (.-route options))
        auth { :user application-id :pass application-secret }
        qs (or (.-params options) {})
        cb (.-cb options)
        method (or (.-method options) "GET")]
    (p (colors.magenta method) url qs)
    (request { :url url :json true :auth auth :qs qs :method method }
             (fn [err, res, body] (if err (throw err)) (cb body res)))))

(defn api-request
  ([route cb] (--api-request { :route route :cb cb }))
  ([route options cb] (--api-request (Object.assign { :route route :cb cb } options))))

(defn async-map [items itemcb cb]
  (let [results (.map items (> nil))
        count (.-length items)]
    (.forEach items
              (fn [item index]
                (itemcb item
                        (>
                         (aset results index it)
                         (if (.every results identity) (cb results))))))))

(defn main []
  (api-request (+ "plans/" plan-id) get-plan-uri-then-items))

(defn get-plan-uri-then-items [body res]
  (api-request (+ (.-request.uri.href res) "/items") handle-plan-items))

(defn filter-items-with-arrangement [items]
  (.filter items (> (.-relationships.arrangement.data it))))

(defn plan-item-attachments-url [plan-item]
  (+ (.-links.self plan-item) "/arrangement/attachments"))

(defn handle-plan-items [body]
  (let [items-with-arrangement (filter-items-with-arrangement (.-data body))
        urls (.map items-with-arrangement plan-item-attachments-url)]
    (async-map urls
               get-spotify-url-for-attachments
               (> (.forEach it (> (p it)))))))

(defn spotify-attachment? [attachment]
  (identical? (.-attributes.pco_type attachment) "AttachmentSpotify"))

(defn get-spotify-url-for-attachments [attachments-url cb]
  (api-request attachments-url
               (> (let [spotify-attachment (.find (.-data it) spotify-attachment?)]
                    (if spotify-attachment
                      (open-attachment spotify-attachment (> (cb (spotify-open-url-to-spotify-uri (.-data.attributes.attachment_url it))))))))))

(defn open-attachment [attachment cb]
  (api-request (+ (.-links.self attachment) "/open") { :method "POST" } cb))

(defn spotify-open-url-to-spotify-uri [url]
  (let [id (last (.split url "/"))]
    (+ "spotify:track:" id)))

(main)
