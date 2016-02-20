from sklearn.datasets import load_files
mysignals=load_files('signal_data_sets')
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
#from sklearn.neighbors import KNeighborsClassifier
#clf = KNeighborsClassifier(n_neighbors=2)
clf.fit(X_train_tfidf, mysignals.target)
i = 0
docs_new = []
while(i < 15):
	docs_new.append('{}'.format(raw_input()))
	i += 1
X_new_counts = count_vect.transform(docs_new)
X_new_tfidf = tfidf_transformer.transform(X_new_counts)
predicted = clf.predict(X_new_tfidf)
def most_common(lst):
    return max(set(lst), key=lst.count)
category = most_common(predicted.tolist())
print(mysignals.target_names[category])
