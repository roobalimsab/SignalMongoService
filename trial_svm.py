from sklearn.datasets import load_files
mysignals=load_files('/Users/roobab/signal_data_sets')
from sklearn.feature_extraction.text import CountVectorizer
count_vect = CountVectorizer()
X_train_counts = count_vect.fit_transform(mysignals.data)
X_train_counts.shape
from sklearn.feature_extraction.text import TfidfTransformer
tfidf_transformer = TfidfTransformer()
X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
X_train_tfidf.shape
from sklearn.svm import SVC
clf = SVC()
clf.fit(X_train_tfidf, mysignals.target)
currentSignal = raw_input()
docs_new=['{}'.format(currentSignal)]
print(docs_new)
X_new_counts = count_vect.transform(docs_new)
X_new_tfidf = tfidf_transformer.transform(X_new_counts)
predicted = clf.predict(X_new_tfidf)
for category in predicted:print(mysignals.target_names[category]) 
