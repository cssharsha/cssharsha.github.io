---
title: "Micro Lie Theory - Sola et al"
date: 2026-06-16
categories: ["robos"]
tags: ["robot", "manifold", "slam"]
math: true
draft: false
---

*Source notebook: [`rmath/lie_algebra_sola.ipynb`](https://github.com/cssharsha/rmath/blob/main/lie_algebra_sola.ipynb) — repo not public yet, link will go live later.*

# Micro Lie Theory - Sola et al

I’ve always known how lie theory is used in SLAM. Had a pretty good
understanding about how the $\boxplus$/$\oplus$ and
$\boxminus$/$\ominus$(I like $o$ notation over $\Box$ notation )
operators are used. But neither of this led me to concretely explain the
theory behind this. I came across this paper very recently. I guess this
is the difference in having formal training as opposed to learning to
swim while you flail around. You stumble upon intersting papers to
develop intuition rather than having been prescribed one.

The most important aspect about understanding theory behind anything is
that there a re a lot of symbols some with good introduction and some
with an unknown etheral layer fetch process. Someone who’s not had a
formal training like me always understands half the concepts and just
fill in the gaps around the rest which results in half baked ideations.
Although this paper doesnt fall in that category and Sola et. al has
provided good context to what each symbols mean and provide background
when introducing them my half developed brain misses them when those
symbols are reused elsewhere in the paper. So this document is just my
personal notes regarding those symbols and in turn my underlying
intution developing tool. I have written this doc on how I understood
it. Some of the text is the same word to word since that is how my mind
parsed the text.

I have some intrusive thoughts that help me add context to where and why
I need this. <span style="color:#888">All those are in this
format</span>. Ignore them if it is obtrusive
<span style="color:#888">which is kinda hard to ignore when you add the
text</span>

## Lie Theory

### Lie Groups

Lie groups are a special kind of groups which satify the axioms that
represent a group that have a smooth manifold. How do you define a
smooth manifold, well it is smooth, doesnt have edges or spikes in plain
english. Mathematically it is something which has a derivative
everywhere. I have no idea how one would prove that it has a derivative
everywhere since for example a function that fomulates SLAM is pretty
non-linear and the manifold of that is supposed to be smooth but I dont
know why. Never went deeper into this question. The four axioms that
define a group ($\mathcal{G}, \circ)$ are: - Closure under ‘$\circ$’:
$\mathcal{X}\circ  \mathcal{Y}\in  \mathcal{G}$ nothing but saying all
the composition of elements in the manifold remains in the manifold -
Identity $\mathcal{E}$:
$\mathcal{X}\circ \mathcal{E}= \mathcal{E}\circ \mathcal{X}= \mathcal{X}$ -
Inverse:
$\mathcal{X}^{-1}\circ \mathcal{X}= \mathcal{X}\circ \mathcal{X}^{-1}= \mathcal{E}$ -
Associativity:
$\mathcal{X}\circ (\mathcal{Y}\circ \mathcal{Z}) = (\mathcal{X}\circ \mathcal{Y}) \circ \mathcal{Z}$

In a Lie Group the “manifold” looks the same at every point. So locally
it can be defined by the same function around the point which is
generally a plane like how we see the earth. The term manifold itself is
not well treated in this paper and I assume if I go to some larger texts
the definition of manifold might become apparent. The statement that
struck out: *Lie Groups provide a way to combine local properties that
allow for doing calculus with the global properties that enables nonlier
composition of distant objects*. This kinda makes sense but wont be able
to explain it well until I have some examples of this.
<span style="color:#888">Ill try finding some to relate - local
properties I know, the lie algebra which allows for taking jacobians but
global properties?</span>

### Lie Group Actions

The most relevant part that ties to robotics and in turn what I
basically want out of this theory is that the lie groups allow
manipulating the elements of other sets. What these “other” sets are is
not again well defined but I just am interested in something like a
position represented as a 3D vector, or a pixel which is a 2D uv vector
and so on. Explaining them in symbols for expanding my ether of
understanding. so we have a Lie group $\mathcal{M}$ and a set
$\mathcal{V}$, the action of $\mathcal{X}\in \mathcal{M}$ on
$\mathcal{v}\in \mathcal{V}$ is represnted by a $\cdot$. Even more
mathametical representation:
$$ \cdot : \mathcal{M}\times \mathcal{V}\rightarrow \mathcal{V}; (\mathcal{X}, \mathcal{v}) \mapsto \mathcal{X}\cdot \mathcal{v}$$
((Here $\times$ is not a cross product or is it)).

There are two more axioms which the $\cdot$ has to satisfy for it to be
considered as a group action. One the group action involving
$\mathcal{E}$ should not modify the vector element $\mathcal{v}$. It has
to have a compatibility property where
$(\mathcal{X}\circ \mathcal{Y}) \cdot \mathcal{v}= \mathcal{X}\cdot ( \mathcal{Y}\cdot \mathcal{v})$.

Another clean way of putting it is lie group has lie group actions that
is an operator that can be used to perform operations on the other set.
these operations are nothing but rotation for example in case of
$\mathcal{SE}(2)$. Ill just list them out like how it is in the paper:
$$\begin{array}{ll@{\qquad\qquad}rcl}
\mathcal{SO}(\mathcal{n}): \text{Rotation matrix} & \mathbf{R}\cdot \mathbf{x} & \triangleq& \mathbf{R}\mathbf{x} \\
\mathcal{SE}(\mathcal{n}): \text{Euclidean matrix} & \mathbf{H} \cdot \mathbf{x} & \triangleq& \mathbf{R}\mathbf{x} + \mathbb{t} \\
\mathcal{S}^{1}: \text{unit complex} & \mathbf{z} \cdot \mathbf{x} & \triangleq& \mathbf{z} \mathbf{x} \\
\mathcal{S}^{3}: \text{unit quaternion} & \mathbf{q} \cdot \mathbf{x} & \triangleq& \mathbf{q}\mathbf{x}\mathbf{q}^* \\
\end{array}$$

Theres one more action *adjoint* which is the basis of all jacobians. I
have not developed the full picture yet to include that here and it is
the same treatment that the paer does as well. So adding it later.

### Lie Algebra

This is the second biggest crux of everything that we actually do in
robotics. All the operations that we doo are generally done in the
tangent space due to the non-linearity of the operations in the lie
group. So this tangent space like all tangents anywhere is just the
first order derivative or the velocity at the point of instance
$\mathcal{t}$. There are a bunch of symbols involved here. Detailing
them out: We have a point $\mathcal{X}(\mathcal{t})$ that is moving in
the manifold $\mathcal{M}$, the velocity
$\dot{\mathcal{X}} = \partial \mathcal{X}/ \partial \mathcal{t}$ is in
the space tanget to $\mathcal{M}$ and it is symbolized as
$T_{\mathcal{X}}\mathcal{M}$. In the future there is $\tau$ that enters
the fray but will only explain it when it is actually required.
<span style="color:#888">Just keeping an eye out for yet another
symbol</span>.

The tangent space at the identity $\mathcal{E}$ is called the *lie
algebra* $\mathfrak{m}\triangleq T_{\mathcal{E}}\mathcal{M}$. I always
glaze over the below facts since they are facts and are inherent when a
lie algebra is defined but stating it out makes it stick: - Lie algebra
$\mathfrak{m}$ is a vector space and the elements are vectors in
$\mathbb{R}^\mathcal{m}$ and the dimension $\mathcal{m}$ is the number
of degrees of freedom of $\mathcal{M}$. For example in $\mathcal{SO}(2)$
the lie algebra elements should have two degrees of freedom
<span style="color:#888">How am I confused of the dof which I have to
know by heart by now</span> - The *exponential map*,
$\exp : \mathfrak{m}\rightarrow \mathcal{M}$ converts **exactly** tje
elements of Lie algebra into elements of the group and the log map does
it in the opposite direction. <span style="color:#888">This is the fact
that always sticks in your head and nothing else</span> - Vectors of the
tangent space at $\mathcal{X}$ can be transformed into the tangent space
at identity $\mathcal{E}$ using the **adjoint**.
<span style="color:#888">this is what it means to exploit global
properties of Lie group I guess</span>.

Some more symbols that get added. I kinda understand why so many new
symbols are required in Lie algebra but sometimes feels like an
overkill. So we represent the vectors in Lie algebras with a ‘hat’
decorator for example ${\mathbf{v}}^{\wedge}$ for velocities and more
generally ${\tau}^{\wedge} = {(\mathbf{v}t)}^{\wedge}$. Some even more
sophisticated symbols allows to specify which tangent space it is part
of like $\mathcal{X}$ left subscript -\>
${}^\mathcal{X}{\mathbf{v}}^{\wedge} \in T_{\mathcal{X}}\mathcal{M}$ and
${}^\mathcal{E}{\mathbf{v}}^{\wedge} \in T_{\mathcal{E}}\mathcal{M}$.
All the element structures are obtained by time differentiating the
constraint of the Lie group, which is just magical.
<span style="color:#888">Or rather it isnt magical. The constraint gives
the equation of the manifold, so when we differentiate it at a
particular point we get the tangent space which is what we want to
extract the equation of the tangent space</span>.

Now here is the kicker in everything. There is a *Cartesian vector
space* which can be used to simplify the representation of this tangent
space <span style="color:#888">formally Lie algebra</span>. Since the
Lie algebra elements are either skew-symmetric matrices, imaginary
numbers or quaternions <span style="color:#888">again imaginary in a
larger space</span> they can be represented as some linear combinations
of some base elements $E_i$ which are called generators of
$\mathfrak{m}$. Ill derive these for each in subsequent sections
<span style="color:#888">I mean recollect the derivations</span>. These
vectors in $\mathbb{R}^\mathcal{m}$ are now handy to manipulate
<span style="color:#888">These are what the optimizer actually
manipulates</span>. To pass from $\mathfrak{m}$ to
$\mathbb{R}^\mathcal{m}$ and back there are mututally inverse linear
maps or *isomorphisms* <span style="color:#888">always thought this was
the definition of an isomorphism</span> called *hat* and *vee*.
<span style="color:#888">These symbols are what confuses me. so we have
elements that are represented using the hat and then there is linear map
called again what do you know *hat*</span>.

$$\begin{array}{l@{\quad}l@{\quad}l}
\text{Hat:} & \mathbb{R}^\mathcal{m}\rightarrow \mathfrak{m}; & \boldsymbol{\tau} \mapsto {\boldsymbol{\tau}}^{\wedge} = \sum_{\mathcal{i}=1}^{\mathcal{m}} \tau_{\mathcal{i}} \mathbf{E}_{\mathcal{i}} \\
\text{Vee:} & \mathfrak{m}\rightarrow \mathbb{R}^\mathcal{m}; & {\boldsymbol{\tau}}^{\wedge} \mapsto {({\boldsymbol{\tau}}^{\wedge})}^{\mathord{\unicode{x2228}}} = \boldsymbol{\tau} = \sum_{\mathcal{i}=1}^{\mathcal{m}} \tau_{\mathcal{i}} \mathbf{e}_{\mathcal{i}}
\end{array}$$

with $\mathbf{e_{i}}$ the base of $\mathbb{R}^\mathcal{m}$

## Lie Groups in Robotics

I was trying to decide whether to add the exponential map, adjoint, plus
and minus operators before adding this section but since those are not
required to define the group and algebra itself my mental model can
atleast withstand the barrage of new symbols when they are dispersed
adding the Lie groups in robotics notes first. For each of the groups it
has an action that it can do on elements of another set which are
generally vectors. As alaways with Lie groups it has to have an identity
and a in inverse.

### $\mathcal{S}^{1}$ : Unit complex numbers group

They take the form of unit complex numbers which are
$\boldsymbol{\mathbf{z}} = cos\theta + \mathcal{i}sin\theta$. - Action:
Vectors $\boldsymbol{\mathbf{x}} = \mathcal{x} + \mathcal{iy}$ by an
angle $\theta$ when complex multiplied
i.e. $\boldsymbol{\mathbf{x}}' = \boldsymbol{\mathbf{z}}\boldsymbol{\mathbf{x}}$ -
Group facts: Product of unit complex number is a unit complex number,
identity is 1 and inverse is the conjugate
$\boldsymbol{\mathbf{z}}^{*}$ - Manifold facts: Since it is constrained
by unit norm, it can be viewed as an unit circle and over time these
evolve on this unit circle. Hence it is 1 DoF.
<span style="color:#888">The actual vector elements they need not be
unit vectors obviously. There must be some relation to this group and
polar coordinates which I should dig deeper to actually understand this
and the quaternion group</span>

### $\mathcal{S}^{3}$: Unit quaternion group

These are unit quaternions under quaternion multiplication that take the
form
$\boldsymbol{\mathbf{q}} = cos(\theta/2) + \boldsymbol{\mathbf{u}}sin(\theta/2)$
with
$\boldsymbol{\mathbf{u}} = \mathcal{i}\mathcal{u}_{x} + j\mathcal{u}_{y} + k\mathcal{u}_{z}$
a unitary axis and $\theta$ a rotation angle.
<span style="color:#888">This is an overparameterized version of the
angle axis which is generally represented by 4D vector \[w, x, y, z\].
Ill try mapping it correctly in the future when I update this
page.</span>. - Action: Vectors $\boldsymbol{\mathbf{x}} = ix + jy + kz$
rotate in 3D space by an angle $\theta$ around the unit axis
$\boldsymbol{\mathbf{u}}$ through the quaternion product
$\boldsymbol{\mathbf{x}}' = \boldsymbol{\mathbf{q}}\boldsymbol{\mathbf{x}}\boldsymbol{\mathbf{q}}^{*}$. -
Group facts: Same as $\S^{1}$ but replacing it with quaternions. -
Manifold facts: This one can easily be represented as a sphere but
manifold is 4-dimensional space(obv time). <span style="color:#888">This
is an alternate representation for $\mathcal{SO}(3)$

### $\mathcal{SO}(3)$: Rotation group

Most of the representations in robotics is this group and the related
family of groups
<span style="color:#888">$\mathcal{SO}(2), \mathcal{SE}(3), \mathcal{SE}(2)$</span>.
So will add the Lie algebra and the vector space $\mathbb{R}^{3}$ that
are super relevant and go hand in hand. - Action: Vectors
$\boldsymbol{\mathbf{x}} = ix + jy + kz$ rotate in 3D space by 3x3
rotation matrix multiplicatin: $\mathbf{R}v$. - Group facts: The inverse
is transpose of the matrix $\mathbf{R}^{\mathbf{T}}$ and the identity is
the identity matrix $\mathbf{I}$ - Manifold facts. The matrix itself is
obviously 9 and the DoF is 3.

#### $\mathcal{SO}(3)$ Lie algebra

Somewhere above in this document I mentioned that the Lie algebra can be
derived by taking time derivative on the constraint.
$$\begin{array}{c@{\qquat}l@r}
\mathbf{R}^{\mathbf{T}}\mathbf{R}& = & \mathbf{I} \\
\mathbf{R}^{\mathbf{T}}\dot{\mathbf{R}} + \dot{\mathbf{R}^{\mathbf{T}}}\mathbf{R}& = & 0 \\
\mathbf{R}^{\mathbf{T}}\dot{\mathbf{R}} & = & -(\dot{\mathbf{R}^{\mathbf{T}}}\mathbf{R}) \\
\mathbf{R}^{\mathbf{T}}\dot{\mathbf{R}} & = & -(\mathbf{R}^{\mathbf{T}}\dot{\mathbf{R}})^{\mathbf{T}}
\end{array}$$

This leads to
$\mathbf{R}^{\mathbf{T}}\dot{\mathbf{R}} = [\omega]_{\times}$ and since
the lie algebra is a tangent at the identity $\mathbf{R}= \mathbf{I}$
the $\dot{\mathbf{R}} = [\omega]_{\times}$ is in the Lie algebra of
$\mathcal{SO}(3)$. The skew symmetric matrix is of the form:
$$[\omega]_{\times} = \begin{bmatrix}
0 & -\omega_{z} & \omega_{y} \\
\omega_{z} & 0 & -\omega_{x} \\
-\omega_{y} & \omega_{x} & 0
\end{bmatrix}$$
The dimension of $\mathcal{SO}(3)$ is 3 and the DoF is 3 and
$[\omega]_{\times} \in \mathfrak{so}(3)$. also the Lie algebra is a
vector space and the elements in it can be decomposed into
$[\omega]_{\times} = \omega_{x}\mathbf{E}_x + \omega_{y}\mathbf{E}_{y} + \omega_{z}\mathbf{E}_{z}$
with
$\mathbf{E}_x = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$,
$\mathbf{E}_y = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ -1 & 0 & 0 \end{bmatrix}$,
$\mathbf{E}_z = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$
as generators of $\mathfrak{so}(3)$ and
$\boldsymbol{\omega} = (\omega_{x}, \omega_{y}, \omega_{z}) \in \mathbb{R}^3$.
As its always been the one to one linear mapping between the Lie albegra
$\mathfrak{so}(3)$ and the cartesian space $\mathbb{R}^{3}$ is done
using *hat* and *vee*.

## Operations of Lie groups/algebra

The word operations seems to be misleading. I named it that for a lack
of a better word. The below concepts is what defines how lie group is
used in practice.

### Exponential Map

To transfer elements from Lie algebra to the group just an exponential
map is sufficient. For example a tangent line is mapped to a geodesic
using the exponential map to beutifully wrap around the manifold. the
inverse map is the *log*. <span style="color:#888">Im not writing the
derivation on how this map is an exp. It depends on the ODE
$\dot{\mathcal{X}} = \mathcal{X}{\mathbf{v}}^{\wedge}$ and finding the
solution for it.</span>

Given a tangent increment
$\boldsymbol{\tau} \triangleq\boldsymbol{\mathbf{v}}t \in \mathbb{R}^\mathcal{m}$
which is velocity per time, the lie algebra is given as the hat of
$\tau$, ${\tau}^{\wedge} = {\mathbf{v}}^{\wedge}t \in \mathfrak{m}$
<span style="color:#888">No idea how ${\mathbf{v}}^{\wedge}$ came into
being and how it is related to $\tau$ but I think Im missing the link
somewhere previously.</span> The exponential map and its inverse “the
logarithmic map are written as:
$$\begin{array}{l@{\qquat}c@{\qquat}c@{\space}l}
\text{exp}: & \mathfrak{m}\rightarrow \mathcal{M} & ; & {\tau}^{\wedge} \mapsto \mathcal{X}= exp({\tau}^{\wedge}) \\
\text{log}: & \mathcal{M} \rightarrow \mathfrak{m}& ; & \mathcal{X}\mapsto {\tau}^{\wedge} = log(\mathcal{X})
\end{array}$$

Closed forms of the exponential are derived from the Taylor
series<span style="color:#888">ding ding ding</span>

#### $\mathcal{SO}(3)$ exponential map

There is a wierd equivalency established between $\boldsymbol{\theta}$
and $\boldsymbol{\omega}$ that is added:
$\boldsymbol{\theta} \triangleq\boldsymbol{\mathbf{u}}\theta \triangleq\boldsymbol{\omega}t \in \mathbb{R}^{3}$.

This equivalency is not at all required since we can directly write the
following equivalencies. We know that
$\mathbf{R}(t) = \text{exp} ([\omega]_{\times}t)$ so naturally we can
write
$\mathbf{R}= \text{exp}([\boldsymbol{\mathbf{u}}]_{\times}\theta)$.

But for some reason an intermediary step of equivalency where
$\mathbf{R}= \text{exp}([\boldsymbol{\theta}]_{\times})$ is used.
Following that the Taylor’s series is computed for the term
$[\boldsymbol{\mathbf{u}}]_{\times}$ since we get
$\mathbf{R}=\text{exp}([\boldsymbol{\theta}]_{\times}) = \sum_{k} \frac{\theta^{k}}{k!} ([\boldsymbol{\mathbf{u}}]_{\times})^{k}$.

Everything is then distilled into multiples of
$\boldsymbol{\mathbf{I}}$, $[\boldsymbol{\mathbf{u}}]_{\times}$ and
$[\boldsymbol{\mathbf{u}}]_{\times}^{2}$. <span style="color:#888">Ive
become super lazy where I ignore these intermediate derivation steps and
sometime in the distant future I stumble on how I got here</span>

The closed form becomes:
$$\mathbf{R}= \text{exp}([\boldsymbol{\mathbf{u}}\theta]_{\times}) = \boldsymbol{\mathbf{I}} + [\boldsymbol{\mathbf{u}}]_{\times} \text{sin}\theta + [\boldsymbol{\mathbf{u}}]_{\times}^{2}(1 - \text{cos}\theta)$$
which is the Rodrigues rotation formula. The same formula can be derived
when considering the unit quaternion group as well
<span style="color:#888">magic</span>.

Some identities which are probably useful in the future:
$$\begin{array}{rcl}
\text{exp}((t+s){\boldsymbol{\tau}}^{\wedge}) & = & \text{exp}(t{\boldsymbol{\tau}}^{\wedge})\text{exp}(s{\boldsymbol{\tau}}^{\wedge}) \\
\text{exp}(t{\boldsymbol{\tau}}^{\wedge}) & = & \text{exp}({\boldsymbol{\tau}}^{\wedge})^{t} \\
\text{exp}(-1{\boldsymbol{\tau}}^{\wedge}) & = & \text{exp}({\boldsymbol{\tau}}^{\wedge})^{-1} \\
\text{exp}(\mathcal{X}{\boldsymbol{\tau}}^{\wedge}\mathcal{X}^{-1}) & = & \mathcal{X}\text{exp}({\boldsymbol{\tau}}^{\wedge})\mathcal{X}^{-1}
\end{array}$$

One other thing to note is that there is a capital exponential mapping
**Exp** which does the mapping directly from cartesian space to
manifold. There is nothing tricky about it

### Plus and minus operators

These operations are pretty straight forward. Rather than the
conventional + and - operators which are for euclidean space, there is
$\oplus$ and $\ominus$ operators that work on the manifold. It allows
for increments between the elements in the curved manifold to be worked
on in the tangent space. Since these operations as with anything to do
with rotations and transformation are not commutative the direction in
which these are applied is important.

Right version: The $\text{Exp}$ appears on the right
$$\begin{array}{l@{\qquant}l}
\text{right-}\oplus: & \mathcal{Y}= \mathcal{X}\oplus {}^\mathcal{X}\tau \triangleq\mathcal{X}\circ \text{Exp(}{}^\mathcal{X}\tau) \in \mathcal{M}\\
\text{right-}\ominus: & {}^\mathcal{X}\tau = \mathcal{Y}\ominus \mathcal{X}\triangleq{}^\mathcal{X}\tau = \text{Log(}\mathcal{X}^{-1} \circ \mathcal{Y}) \in T_{\mathcal{X}}\mathcal{M}
\end{array}$$

Left version: The $\text{Exp}$ appears on the left
$$\begin{array}{l@{\qquant}l}
\text{left-}\oplus: & \mathcal{Y}= {}^\mathcal{E}\tau \oplus \mathcal{X}\triangleq\text{Exp(}{}^\mathcal{E}\tau) \circ \mathcal{X}\in \mathcal{M}\\
\text{left-}\ominus: & {}^\mathcal{E}\tau = \mathcal{Y}\ominus \mathcal{X}\triangleq{}^\mathcal{E}\tau = \text{Log(}\mathcal{Y}\circ \mathcal{X}^{-1}) \in T_{\mathcal{X}}\mathcal{M}
\end{array}$$

In the $\ominus$ for right and left, the direction of application is
same in both righ and left since its the difference but it is confusing
to determine though. The right operators are applied in the local frame
as opposed to the global frame in the left operator
<span style="color:#888">Becomes more apparent when applying the between
factor and a global unary factor for the pose. Depends on where the
measurement is taken. Will update a clear example with the calculations
on how to apply in practice.</span>

### Adjoint and the adjoint matrix

Since there are two ways that $\mathcal{Y}$ can be represented and two
tangent spaces from which is is related to, one in the local tangent
space to $\mathcal{X}$ and one at the tangent space at identity
$\mathcal{E}$ which is global there is a linear map that converts
between these two spaces. this linear map is called the adjoint.

$$\begin{array}{rcl}
{}^\mathcal{E}\tau \oplus \mathcal{X}& = & \mathcal{X}\oplus {}^\mathcal{X}\tau \\
\text{Exp}({}^\mathcal{E}\tau)\mathcal{X}& = & \mathcal{X}\text{Exp}({}^\mathcal{X}\tau) \\
\text{exp}({}^\mathcal{E}{\tau}^{\wedge}) & = & \mathcal{X}\text{exp}({}^\mathcal{X}{\tau}^{\wedge})\mathcal{X}^{-1} = \text{exp}(\mathcal{X}{}^\mathcal{X}{\tau}^{\wedge}\mathcal{X}^{-1}) \\
{}^\mathcal{E}{\tau}^{\wedge} & = & \mathcal{X}{}^\mathcal{X}{\tau}^{\wedge}\mathcal{X}^{-1}
\end{array}$$

The adjoint of $\mathcal{M}$ at $\mathcal{X}$ which is represented as
$\text{Ad}_\mathcal{X}: \mathfrak{m}\rightarrow \mathfrak{m}; {\tau}^{\wedge} \mapsto \text{Ad}_\mathcal{X}({\tau}^{\wedge}) \triangleq\mathcal{X}{}^\mathcal{X}\tau\mathcal{X}^{-1}$

<span style="color:#888">Mathematically this makes absolute sense but I
have not idea where this would be directly used. I mean the adjoint, not
the adjoint matrix since we dont do any operations in the Lie algebra
but rather in the cartesian space.</span>

The adjoint matrix
$\operatorname{Ad}_{\boldsymbol{\mathcal{X}}}: \mathbb{R}^\mathcal{m}\rightarrow \mathbb{R}^\mathcal{m}; {}^\mathcal{X}\tau \mapsto {}^\mathcal{E}\tau = \operatorname{Ad}_{\boldsymbol{\mathcal{X}}}\tau$
is used to linearly map the elements in the cartesian space at
$\mathcal{X}$ and the cartesian space at $\mathcal{E}$.

There are some identitites for each of the above operations. Ill just
skip adding them here since its just repetitive. To get the adjoint
matrix just apply the *vee* operator on the adjoint.

#### Adjoint matrix of $\mathcal{SE}(3)$

\$ =
, =
, =
\$

From the previous definition of the adjoint matrix,
$\operatorname{Ad}_{\boldsymbol{\mathbf{M}}}\tau = {(\mathbf{M}{\tau}^{\wedge}\mathbf{M}^{-1})}^{\mathord{\unicode{x2228}}}$.
Rearranging and using some identities the adjoint matrix is finally
derived as
$\operatorname{Ad}_{\mathbf{M}} = \begin{bmatrix} \mathbf{R}& [\mathbf{t}]_{\times}\mathbf{R}\\ 0 & \mathbf{R}\end{bmatrix} \in \mathbb{R}^{6\times6}$.
<span style="color:#888">In the derivation the identities applied and
the *vee* operator itself seems like black magic, but it eassy to follow
if I had invested some time into exploring those which I did not. I feel
that it is not needed</span>

### Derivatives on Lie Group

#### Jacobians on vector spaces

Any derivates in the context of Lie groups are taken in the form of
Jacobian matrices mapping vector tangent spaces. The uncertainities and
increments can actually be properly defined in this space. The
uncertainities in Lie groups are mostly Jacobians in the vector space.
Everything related to Jacobians has been the same since I first started
using them <span style="color:#888">I meant the symbols, there’s no
gotchas here and it is absolutely the same representation. Although
there is one unnecessary detail added but I guess it is there for
completeness</span>. A Jacobian matrix for a multivariate function
$\mathcal{f} : \mathbb{R}^\mathcal{m}\rightarrow \mathbb{R}^{n}$ is
defined as a $n \times m$ matix stacking all the partial derivatives:

$$\boldsymbol{\mathbf{J}} = \frac{\partial{f(\mathbf{x})}}{\partial{\mathbf{x}}} \triangleq\begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_m} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_n}{\partial x_1} & \cdots & \frac{\partial f_n}{\partial x_m} \end{bmatrix} \in \mathbb{R}^{n\times m}$$

Theres some formulation which partitions this matrix into columns for a
different representation and eventually relate this to perturbations
i.e. $\boldsymbol{\mathbf{J}} = [\boldsymbol{\mathbf{j_{1}}} \cdots \boldsymbol{\mathbf{j_{m}}}]$
and
$\boldsymbol{\mathbf{j_{i}}} = [\frac{\partial f_{1}}{\partial x_{i}} \cdots \frac{\partial f_{n}}{\partial x_{i}}]^{\top}$.
It says that the column vector responds to
$$\boldsymbol{\mathbf{j_{i}}} = \frac{\partial{f(\mathbf{x})}}{\partial{\mathbf{x}_{i}}} \triangleq\lim_{h \to 0} \frac{f(\mathbf{x} + h \mathbf{e}_{i}) - f(\mathbf{x})}{h} \in \mathbb{R}^{n}$$
where $\mathbf{e}_{i}$ is the $i$-th vector of the natural basis of
$\mathbb{R}^\mathcal{m}$.

<span style="color:#888">The Linear algebra stuff. Again it is pretty
straight forward how LA works but there are somethings which I did not
have a formal education in which leads to some gaps in terminaology that
trips me over but it is nothing to trip over. The $\mathbf{e}_i$ is
nothing but each coordinate axis(the simpler one not the rotated or
translated one). So the partial derivative in turn calculates these
nudges along each axis. Also note that tis all lives in the vector
tangent space.</span>

There are some re-representation of $\boldsymbol{\mathbf{J}}$ to match
the limit representation. It clubs all the $x_i$s into one vector and
has an $\boldsymbol{\mathbf{h}}$ in the denominator which does not make
sense since it is a vector but it is useful for computing the Jacobian
by making the numerator a form linear in $\boldsymbol{\mathbf{h}}$ that
enables this. And with this representation, for small values of
$\boldsymbol{\mathbf{h}}$ the linear approximation is evident:
$$f(\boldsymbol{\mathbf{x}} + \boldsymbol{\mathbf{h}}) \xrightarrow[h \to 0]{} f(\boldsymbol{\mathbf{x}}) + \frac{\partial f(\boldsymbol{\mathbf{x}})}{\partial \boldsymbol{\mathbf{x}}}\boldsymbol{\mathbf{h}}$$

#### Right Jacobians on Lie groups

Now transotioning to the jacobians on the Lie groups. The link all the
way from jacobians in the vector spaces up until the jacobians in Lie
groups will become apparent later. Using the $\oplus$ and $\ominus$
definitions to come up with the derivatives. Right jcobian meaning the
tangent space at the local frame:
$\frac{{}^\mathcal{X}Df(\mathcal{X})}{D\mathcal{X}}$.
<span style="color:#888">When going through these derivations without
context(behaving like a markovian) then it becomes difficult to deduce
things but when we subsituting the actual manifold operators it makes
sense why they were defined in the first place</span>

$$\frac{{}^\mathcal{X}Df(\mathcal{X})}{D\mathcal{X}} \triangleq\lim_{\boldsymbol{\tau} \to 0} \frac{f(\mathcal{X}\oplus \tau) \ominus f(\mathcal{X})}{\tau} \in \mathbb{R}^{n \times m}$$

Applying the actual definitions of the manifold operators we get:

$$= \lim_{\tau \to 0}\frac{\operatorname{Log}(f(\mathcal{X})^{-1} \circ f(\mathcal{X}\circ \operatorname{Exp}(\tau)) )}{\tau}
= \frac{\partial \operatorname{Log}(f(\mathcal{X})^{-1} \circ f(\mathcal{X}\circ \operatorname{Exp}(\tau)) )}{\partial \tau}$$

With all this hullabaloo it’s just signifies that the derivative of
$f(\mathcal{X})$ w.r.t $\mathcal{X}$ is calculated using the
infintesimal variations in the tangent spaces. With this, the Jacobians
are derived from the tangent spaces and the actual derivaties are all
similarly w.r.t each direction as in the vector tangent spaces.

##### Example for $\mathcal{SO}(3)$

For function
$f: \mathcal{SO}(3) \rightarrow \mathbb{R}^3; f(\mathbf{R}) = \mathbf{R}\mathbf{p}$
the derivative(jacobian) at the local coordinate frame(the right
jacobian) is given by
$$\begin{array}{l}
\frac{{}^\mathbf{R}D \mathbf{R}\mathbf{p}}{D \mathbf{R}} = \lim_{\theta \to 0} \frac{(\mathbf{R}\oplus \theta) \mathbf{p} \ominus \mathbf{R}\mathbf{p}}{\theta} = \lim_{\theta \to 0} \frac{\mathbf{R}\operatorname{Exp}(\theta)\mathbf{p} - \mathbf{R}\mathbf{p}}{\theta}\\
= \lim_{\theta \to 0} \frac{\mathbf{R}(\mathbf{I} + [\theta]_{\times})\mathbf{p} - \mathbf{R}\mathbf{p}}{\theta} = \lim_{\theta \to 0} \frac{\mathbf{R}[\theta]_{\times} \mathbf{p}}{\theta} \\
= \lim_{\theta \to 0} \frac{-\mathbf{R}[\mathbf{p}]_{\times} \theta}{\theta} = -\mathbf{R}[\mathbf{p}]_{\times} \in \mathbb{R}^{3 \times 3}
\end{array}$$

<span style="color:#888">Here are some symbols that are thrown around a
bit. We have $\tau$ equated to $\theta$. Generally when we have a
function say $f(\mathbf{x})$ we take a derivative w.r.t $\mathbf{x}$ but
in the Lie group we are taking the limit w.r.t a second variable
$\tau \triangleq\theta$ which is considererd to be very small
perturbations. The $\ominus$ in case of a point and point is just a
cartesian substraction(since a rotated point is still a point even if
the rotation happens in the manifold). Theres one identity that I missed
mentioning anywhere earlier I think that transfers the $[.]_{\times}$
from $\theta$ to $\mathbf{p}$.</span>

Again as in the tangent space jacobian,
$$f(\mathcal{X}\oplus {}^\mathcal{X}\tau) \xrightarrow[{}^\mathcal{X}\tau \to 0]{} f(\mathcal{X}) \oplus \frac{{}^\mathcal{X}Df(\mathcal{X})}{D\mathcal{X}} {}^\mathcal{X}\tau \in N $$

#### Left Jacobian on Lie groups

Similar to the right Jacobian the left jacobians are defined by:

$$\begin{array}{l}
\frac{{}^\mathcal{E}Df(\mathcal{X})}{D\mathcal{X}} \triangleq\lim_{\boldsymbol{\tau} \to 0} \frac{f(\tau \oplus \mathcal{X}) \ominus f(\mathcal{X})}{\tau} \in \mathbb{R}^{n \times m} \\
= \lim_{\tau \to 0}\frac{\operatorname{Log}( f(\operatorname{Exp}(\tau) \circ \mathcal{X}) ) \circ f(\mathcal{X})^{-1})}{\tau} \\
= \frac{\partial \operatorname{Log}( f(\operatorname{Exp}(\tau) \circ \mathcal{X}) ) \circ f(\mathcal{X})^{-1})}{\partial \tau}
\end{array}$$
And following in the footsteps of vector tangent space and the right
jacobian,
$$f({}^\mathcal{E}\tau \oplus \mathcal{X}) \xrightarrow[{}^\mathcal{E}\tau \to 0]{} \frac{{}^\mathcal{E}Df(\mathcal{X})}{D\mathcal{X}} {}^\mathcal{E}\tau \oplus f(\mathcal{X}) \in N $$

And adjoint is again used to relate the left and the right(identity
tangent and the local tangent space)
$$\frac{{}^\mathcal{E}Df(\mathcal{X})}{D\mathcal{X}} \operatorname{Ad}_{\mathcal{X}} = \operatorname{Ad}_{f(\mathcal{X})} \frac{{}^\mathcal{X}Df(\mathcal{X})}{D\mathcal{X}}$$

There’s this crossed right-left jacoians where te function is in the
local frame and the derivative needs to be in the global frame or
vice-versa, there is an equivalence that is defined using the adjoint.
<span style="color:#888"> No idea where this is actully used. So skipped
writing it down here</span>

### Uncertainity in manifolds, covariance propagation

Local perturbations $\tau$ around a point a point
$\bar{\mathcal{X}} \in M$ in the tangent vector space
$\mathbf{T}_{\bar{\mathcal{X}}}M$ is represented using the $\oplus$ and
$\ominus$ as
$$\mathcal{X}= \bar{\mathcal{X}} \oplus \tau, \tau = \mathcal{X}\ominus \bar{\mathcal{X}} \in \mathbf{T}_{\bar{\mathcal{X}}}M$$

Covariance matrices are then defined in this tangent space at
$\bar{\mathcal{X}}$ through the standard expectation operator
$\mathbb{E}[.]$:
$$\Sigma_{\mathcal{X}} \triangleq= \mathbb{E}[\tau \tau^\top] = \mathbb{E}[(\mathcal{X}\ominus \bar{\mathcal{X}})(\mathcal{X}\ominus \bar{\mathcal{X}})^\top] \in \mathbb{R}^{m \times m}$$
This allows for representing tGaussian variables on manifolds,
$\mathcal{X}\sim \mathcal{N}(\bar{\mathcal{X}}, \Sigma_{\mathcal{X}})$
<span style="color:#888">Computing covariace is pretty much the same
whatever might be the group</span> This covariance is actually that of
$\tau$ even if it is written for $\mathcal{X}$. As the dimension m of
this tangent space mathes the DoF of $\mathcal{M}$ the covariances are
well defined. Else they are not. The perturbations can also be
represented with left-minus and thus the covariances can be represented
in the global frame. Again the magical adjoint is used to convert
between the local and global perturnations.

To propagate the covariance through a function
$f : \mathcal{M}-> \mathcal{N}; \mathcal{X}\mapsto \mathcal{Y}= f(\mathcal{X})$
is the all weathered linearization with jacobian matrices trick:
$$\Sigma_\mathcal{Y}\approx \frac{Df}{D\mathcal{X}} \Sigma_{\mathcal{X}} {\frac{Df}{D\mathcal{X}}}^\top \in \mathbb{R}^{n \times n}$$

### Discrete integration on manifolds

This is mostly stating some facts. The
$\mathcal{X}(t) = \mathcal{X}_{0} \circ \operatorname{Exp}(\boldsymbol{\mathbf{v}}t)$
is the integral with constant velocity. If it non constant just split
them up and then integrate it. Suppose
$\mathbf{v}_k \in \mathbf{T}_{{\mathcal{X}}_{k-1}} \mathcal{M}$ is the
piecewise constant bits representing $\mathbf{v}(t)$ then the integral
is written as:
$$\begin{array}{aligned}
\mathcal{X}_{k} &= \mathcal{X}_{0} \circ \operatorname{Exp}(\mathbf{v}_1)\partial{t_{1}} \circ \operatorname{Exp}(\mathbf{v}_2)\partial{t_{2}} \circ \cdots \circ \operatorname{Exp}(\mathbf{v}_k)\partial{t_{k}} \\
&= \mathcal{X}_{0} \oplus \mathbf{v}_1\partial{t_{1}} \oplus \mathbf{v}_2\partial{t_{2}} \circ \cdots \circ \mathbf{v}_k\partial{t_{k}}
\end{array}$$

<span style="color:#888"> I have never really done any EKF in manifold
up until now so haven’t really used this kind of formulaization anywhere
tbh.</span>

## Differentiation Rules on Manifold

The closed form solutions for inversion, composition, exponentiation and
action can be determined for all the manifolds used. And some end up
being related to the $\operatorname{Ad}_{\mathcal{X}}$. Chain rule is
used after these building blocks/forms are computed to derive the
jacobians for anything else.

<span style="color:#888">Im going over this much length to write down
every detail in the tutorial for the reason I explicitly mentioned in
the beginning of the document. There are so many symbols introduced and
everything downstream of this are representing explained using those
symbols without this much of detailed context. The conventions here are
almost the same used in almost all the other literatures. Hence the
painstaking latex explainations.</span>

### Chain rule

Chain rule is chain rule. This is nothing new, but when mixing left,
right and cross jacobians the frame matters.

For $\mathcal{Y}= f(\mathcal{X})$ and $\mathcal{Z}= g(\mathcal{Y})$ it
is implied that $\mathcal{Z}= g(f(\mathcal{X}))$ and the chain rule is
$$\frac{D\mathcal{Z}}{D\mathcal{X}} = \frac{D\mathcal{Z}}{D\mathcal{Y}} \frac{D\mathcal{Y}}{D\mathcal{X}} \qquad or \qquad \boldsymbol{\mathbf{J}}^{\mathcal{Z}}_{\mathcal{X}} = \boldsymbol{\mathbf{J}}^{\mathcal{Z}}_{\mathcal{Y}} \boldsymbol{\mathbf{J}}^{\mathcal{Y}}_{\mathcal{X}}$$

### Elementary Jacobian Blocks

#### Inverse

$$\boldsymbol{\mathbf{J}}^{\mathcal{X}^{-1}}_{\mathcal{X}} \triangleq\frac{{}^\mathcal{X}D \mathcal{X}^{-1}}{D \mathcal{X}}$$

Probably the author got tired with repeating the same definition of
derivative over and over and skipped the initial definition.
<span style="color:#888">But no way I would do that</span>
$$\begin{array}{lcl}
\boldsymbol{\mathbf{J}}^{\mathcal{X}^{-1}}_{\mathcal{X}} & = & \lim_{\tau \to 0} \frac{f(\mathcal{X}\oplus \tau) \ominus f(\mathcal{X})}{\tau} \qquad with \: f(\mathcal{X}) = \mathcal{X}^{-1}\\
& = & \lim_{\tau \to 0} \frac{(\mathcal{X}\oplus \tau)^{-1} \ominus \mathcal{X}^{-1}}{\tau} \\
& = & \lim_{\tau \to 0} \frac{\operatorname{Log}{((\mathcal{X}^{-1})^{-1} (\mathcal{X}\operatorname{Exp}(\tau))^{-1}})}{\tau} \\
& = & \lim_{\tau \to 0} \frac{\operatorname{Log}{(\mathcal{X}\operatorname{Exp}(-\tau)\mathcal{X}^{-1}})}{\tau} \\
& = & \lim_{\tau \to 0} \frac{{(\mathcal{X}{(-\tau)}^{\wedge}\mathcal{X}^{-1})}^{\mathord{\unicode{x2228}}}}{\tau} \\
& = & -\operatorname{Ad}_{\mathcal{X}}
\end{array}$$

#### Composition

$$\begin{array}{l}
\boldsymbol{\mathbf{J}}^{\mathcal{X}\circ \mathcal{Y}}_{\mathcal{X}} \triangleq\frac{{}^\mathcal{X}D \mathcal{X}\circ \mathcal{Y}}{D \mathcal{X}} \qquad \in \mathbb{R}^{m \times m} \\
\boldsymbol{\mathbf{J}}^{\mathcal{X}\circ \mathcal{Y}}_{\mathcal{Y}} \triangleq\frac{{}^\mathcal{Y}D \mathcal{X}\circ \mathcal{Y}}{D \mathcal{Y}} \qquad \in \mathbb{R}^{m \times m}
\end{array}$$

The frame in which the derivatives are taken is important.
<span style="color:#888">although tbh it is a bit iffy on its
application</span>

Simlifying the equations above:
$$\begin{array}{l}
\boldsymbol{\mathbf{J}}^{\mathcal{X}\circ \mathcal{Y}}_{\mathcal{X}} = {\operatorname{Ad}_{\mathcal{Y}}}^{-1}\\
\boldsymbol{\mathbf{J}}^{\mathcal{X}\circ \mathcal{Y}}_{\mathcal{Y}} = \boldsymbol{\mathbf{I}}
\end{array}$$

#### Jacobians of $\mathcal{M}$

The right jacobian of $\mathcal{M}$ is the right jacobian of
$\mathcal{X}= \operatorname{Exp}(\tau)$ for $\tau \in \mathbb{R}^m$

$$\begin{array}{l}
\boldsymbol{J}_r(\tau) \triangleq\frac{{}^{\tau}D\operatorname{Exp}(\tau)}{D\tau} \in \mathbb{R}^{m \times m} \\
\boldsymbol{J}_l(\tau) \triangleq\frac{{}^{\mathcal{E}}D\operatorname{Exp}(\tau)}{D\tau} \in \mathbb{R}^{m \times m}
\end{array}$$

These are pretty important in edriving the jacobian in the local frame
and the global frame. For instance the between factor, the measurement
is in the local frame and hence it would be a right jacobian and a
measurement such as unary pose is a left jacobian. There are ways to
convert it from one to the other. <span style="color:#888">Have to
actually go through the implementations in either GTSAM or manif to
check whats going on here for better intuition. Refer the other page
where I stumble my through sympy to implement these.</span>

#### Jacobians on Group actions

These are again specialized implementations which I will tie back to
this section when I implement them in the other page. Im mostly thinking
probably the reprojection factor or any other such factors. But writing
the definition here to be fancy complete:

$$\begin{array}{lcl}
\boldsymbol{\mathbf{J}}^{\mathcal{X}\cdot v}_{\mathcal{X}} & \triangleq& \frac{{}^\mathcal{X}D \mathcal{X}\cdot v}{D \mathcal{X}} \\ 
\boldsymbol{\mathbf{J}}^{\mathcal{X}\cdot v}_{v}  & \triangleq& \frac{{}^v D \mathcal{X}\cdot v}{D v}
\end{array}$$

## Composite Manifolds

The way this is explained in the paper leads to quite some confusion.
This is how a complete system of lets say a map is represented where
each state,
$\mathcal{X}_{1}, \mathcal{X}_{2}, \mathcal{X}_{3}, \cdots , \mathcal{X}_{n}$
are their own separate manifolds lets say $\mathcal{SE}(3)$. The group
axioms which generally apply to a manifold is broken down where the
axioms are applied individually rather than to the complete group:

$$\mathcal{E}_\diamond \triangleq\begin{bmatrix} \mathcal{E}_1 \\ \vdots \\ \mathcal{E}_M \end{bmatrix}, \: \mathcal{X}^\diamond \triangleq\begin{bmatrix} \mathcal{X}^{-1}\\ \vdots \\ \mathcal{X}^{-1}_{M} \end{bmatrix}, \: \mathcal{X}\diamond \mathcal{Y}\triangleq\begin{bmatrix} \mathcal{X}\circ \mathcal{Y}_1 \\ \vdots \\ \mathcal{X}_M \circ \mathcal{Y}_M \end{bmatrix},$$

represent the identity, inverse and the composition.

Also there is a new right-plus and minus:

$$\begin{array}{lcl}
\mathcal{X}\mathbin{\overset{\diamond}{\oplus}}\tau & \triangleq& \mathcal{X}\diamond \operatorname{Exp}\langle \tau \rangle \\
\mathcal{Y}\mathbin{\overset{\diamond}{\ominus}}\mathcal{X}& \triangleq& \operatorname{Log}\langle \mathcal{X}^\diamond \diamond \mathcal{Y} \rangle
\end{array}$$

Everything downstream is just a redo with the same logic. The
derivatives would be

$$\frac{Df(\mathcal{X})}{D\mathcal{X}} \triangleq\lim_{\tau \to 0} \frac{f(\mathcal{X}\mathbin{\overset{\diamond}{\oplus}}\tau) \mathbin{\overset{\diamond}{\ominus}}f(\mathcal{X})}{\tau}$$

## Jacobians

List of all of the jacobians that are most commonly encounterd.

### $SE(2)$

#### Rigid motion action

Jacobians of action of the manifold on a vector

$$\begin{array}{lcl}
\boldsymbol{\mathbf{J}}^{\mathbf{M}.\mathbf{p}}_{\mathbf{M}} & = & \lim_{\tau \to 0} \frac{\mathbf{M}\text{Exp}(\tau).\mathbf{p} - \mathbf{M}.\mathbf{p}}{\tau}
& = & \begin{bmatrix} \mathbf{R}& \mathbf{R}[1]_{\times} \mathbf{p} \end{bmatrix} \\
\boldsymbol{\mathbf{J}}^{\mathbf{M}.\mathbf{p}}_{\mathbf{p}} & = & \mathbf{R}
\end{array}$$

### EKF 2D - $SE(2)$ pose, 2D vector landmark

State
$\mathcal{X}= \begin{bmatrix} \mathbf{R}& \boldsymbol{\mathbf{t}} \\ 0 & 1 \end{bmatrix} \in SE(2), \mathbf{b}_{k} = \begin{bmatrix} x_{k} \\ y_{k} \end{bmatrix} \in \mathbb{R}^{2}$

Action/control/twist
$\boldsymbol{\mathbf{u}} = \begin{bmatrix} u_v \\ u_s \\ u_{\omega} \end{bmatrix} = \begin{bmatrix} v \delta t \\ 0 \\ \omega \delta t \end{bmatrix} + \boldsymbol{\mathbf{w}} \in \mathbb{R}^2$

$\boldsymbol{\mathbf{W}} = \begin{bmatrix} \sigma^{2}_{v} & 0 & 0 \\ 0 & \sigma^{2}_{s} & 0 \\ 0 & 0 & \sigma^{2}_{\omega} \end{bmatrix} \in \mathbb{R}^{3 \times 3}$

Assuming that the estimation error is $\delta x$ and its covarince is
$\boldsymbol{\mathbf{P}}$ they are derived using:

$$\begin{array}{lcl}
\delta \boldsymbol{\mathbf{x}} \triangleq\mathcal{X}\ominus \hat{\mathcal{X}}  & \in \mathbb{R}^3 \\
\boldsymbol{\mathbf{P}} \triangleq\mathbb{E}[(\mathcal{X}\ominus \hat{\mathcal{X}})(\mathcal{X}\ominus \hat{\mathcal{X}})^\top] & \in \mathbb{R}^{3 \times 3}
\end{array}$$

#### Prediction step

$$\begin{array}{lcl}
\hat{\mathcal{X}_j} & = & \hat{\mathcal{X}_i} \oplus \mathbf{u}_j \\
\boldsymbol{P}_j & = & \boldsymbol{\mathbf{F}} \boldsymbol{\mathbf{P}}_j \boldsymbol{\mathbf{F}}^\top + \boldsymbol{\mathbf{G}} \boldsymbol{\mathbf{W}}_j \boldsymbol{\mathbf{G}}^\top
\end{array}$$

where $\boldsymbol{\mathbf{F}}$ and $\boldsymbol{\mathbf{G}}$ is the
linearization of the action and the noise. One cool thing is that the
Exp maps the sin and cos for the $SE(2)$ group and thus no need to
actually write them out like how I used to write stuff by hand.

$$\begin{array}{lcl}
\boldsymbol{\mathbf{F}} \triangleq\boldsymbol{\mathbf{J}}^{\mathcal{X}_j}_{\mathcal{X}_i} = \boldsymbol{\mathbf{J}}^{\mathcal{X}_i \oplus \boldsymbol{u}_j}_{\mathcal{X}_i} = \operatorname{Ad}_{\text{Exp}(\boldsymbol{\mathbf{u}})}^{-1}\\
\boldsymbol{\mathbf{G}} \triangleq\boldsymbol{\mathbf{J}}^{\mathcal{X}_j}_{\boldsymbol{\mathbf{u}}_j} = \boldsymbol{\mathbf{J}}^{\mathcal{X}_i \oplus \boldsymbol{u}_j}_{\boldsymbol{\mathbf{u}}_j} = \boldsymbol{\mathbf{J}}_r(\boldsymbol{\mathbf{u}}_j)
\end{array}$$
<span style="color:#888">Havent derived any of these and am assuming
that these just work. Would have wanted to derive them to “click” but
these seem pretty straightforward so skipped it</span>

#### Updation step

There is a slight difference between the measurement model between what
is mentioned in the paper and what I will be using
<span style="color:#888"> basically what my prof used in his
lectures</span>:

$\text{range r} = \lVert \mathcal{X}^{-1}. \boldsymbol{\mathbf{b}}_k \rVert$

and noise for this is a scalar:

$\boldsymbol{\mathbf{N}} = \sigma_r$

With this model the innovation changes but everything else should remain
the same <span style="color:#888"> and obviously the H changes, which
follows these equations.

$$\begin{array}{lcl}
\text{Innovation:} & \boldsymbol{\mathbf{z}} = \mathbf{r} - \lVert \hat{\mathcal{X}}^{-1}. \boldsymbol{\mathbf{b}}_k \rVert \\
\text{Innovation cov.:} & \boldsymbol{\mathbf{Z}} = \boldsymbol{\mathbf{H}} \boldsymbol{\mathbf{P}} \boldsymbol{\mathbf{H}}^\top + \boldsymbol{\mathbf{N}} \\
\text{Kalman gain:} & \boldsymbol{\mathbf{K}} = \boldsymbol{\mathbf{P}} \boldsymbol{\mathbf{H}}^\top \boldsymbol{\mathbf{Z}}^{-1}\\
\text{Observed error:} & \delta \boldsymbol{\mathbf{x}} = \boldsymbol{\mathbf{K}} \boldsymbol{\mathbf{z}} \\
\text{State update:} & \hat{\mathcal{X}} \leftarrow \hat{\mathcal{X}} \oplus \delta x \\
\text{Cov. update:} & \boldsymbol{\mathbf{P}} \leftarrow \boldsymbol{\mathbf{P}} - \boldsymbol{\mathbf{K}}\boldsymbol{\mathbf{Z}}\boldsymbol{\mathbf{K}}^\top
\end{array}$$

jacobians H is:

$$\begin{array}{lcl}
\boldsymbol{\mathbf{H}} & \triangleq& \boldsymbol{\mathbf{J}}^{\mathbf{r}}_{\mathcal{X}} = \boldsymbol{\mathbf{J}}^{\mathbf{r}}_{\mathcal{X}^{-1}.\boldsymbol{\mathbf{b}}_k}.\boldsymbol{\mathbf{J}}^{X^{-1}.\boldsymbol{\mathbf{b}}_k}_{\mathcal{X}^{-1}}.\boldsymbol{\mathbf{J}}^{\mathcal{X}^{-1}}_{\mathcal{X}}
\end{array}$$

$\mathcal{X}^{-1}.\boldsymbol{\mathbf{b}}_k$ is a point in the body
frame. For the first term we are taking the derivative of the range with
respct to this landmark point in the body frame. It is then chained with
the derivative of the point in the body frame wrt local body pose and
finally chained to the derivative of the local body pose to the world
pose which is given by the adjoint matrix. <span style="color:#888">
Again the magic of manifod Lie theory, if we multiply out these we
should get the cleanly hand written 1x3 matrix that we usaually write
out</span>
